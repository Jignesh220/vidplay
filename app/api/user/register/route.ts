import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/utils/Cloudinary";
import { uploadFileToLocalServer } from "@/utils/UploadFileToLocal";
import { ApiError } from "@/utils/ApiError";
import { User } from "@/models/user.model";

function validateField(fieldName: string, value: string): string {
    if (!value.trim()) {
        throw new ApiError(400, `${fieldName} is required`);
    }
    return value;
}

function validateFileField(fieldName: string, file: File): File {
    if (!file) {
        throw new ApiError(400, `${fieldName} is required`);
    }
    return file;
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();

        const [username, fullName, email, password, avatar, coverImage] =
            await Promise.all([
                validateField("username", data.get("username") as string),
                validateField("fullName", data.get("fullName") as string),
                validateField("email", data.get("email") as string),
                validateField("password", data.get("password") as string),
                validateFileField("avatar", data.get("avatar") as File),
                data.get("coverImage") as File,
            ]);

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            throw new ApiError(
                409,
                "User with email or username already exists"
            );
        }

        const avatarPath = await uploadFileToLocalServer(avatar);
        if (!avatarPath) {
            throw new ApiError(400, "invalid avatar image");
        }
        const avatarUrl = await uploadOnCloudinary(avatarPath);

        if (!avatarUrl) {
            throw new ApiError(401, "Avatar image not uploaded");
        }
        let coverImagePath;
        if (coverImage) {
            coverImagePath = await uploadFileToLocalServer(coverImage);
            if (!coverImagePath) {
                throw new ApiError(400, "invalid cover image");
            }
        }
        const coverImageUrl = await uploadOnCloudinary(coverImagePath!);

        const user = await User.create({
            fullName,
            email,
            username: username.toLowerCase(),
            password,
            avatar: avatarUrl.url,
            coverImage: coverImageUrl?.url,
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(500, "something went wrong while creating user");
        }

        return NextResponse.json(
            { createdUser},
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error, message: error.message },
            { status: 400 }
        );
    }
}

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { NextResponse } from "next/server";
import { ApiError } from "./ApiError";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        console.log(localFilePath);

        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "vidPlay"
        });
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error: any) {
        console.log(error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        throw new ApiError(400, error.message);
    }
};
const deleteFromCloudinary = async (fileUrl: any) => {
    try {
        if (!fileUrl) return null;
        //upload the file on cloudinary
        const resID = fileUrl.split("/").pop().split(".")[0];
        const response = await cloudinary.uploader.destroy(resID);
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        return response ? true : false;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };

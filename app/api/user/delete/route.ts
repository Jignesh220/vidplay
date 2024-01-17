import { deleteFromCloudinary } from "@/utils/Cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { path } = reqBody;
        console.log(path);
        

        const response = await deleteFromCloudinary(path);
        console.log(response);

        return NextResponse.json({ message: "ok" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
};

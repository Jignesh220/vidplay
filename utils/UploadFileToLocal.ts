import fs from "fs";
import { ApiError } from "./ApiError";

const uploadFileToLocalServer = async (file: File) => {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // With the file data in the buffer, you can do whatever you want with it.
        // For this, we'll just write it to the filesystem in a new location
        const path = `./public/temp/${
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            "." +
            file.name.split(".")[1]
        }`;
        await fs.promises.writeFile(path, buffer);
        return path;
    } catch (error: any) {
        throw new ApiError(
            400,
            error.message ||
                "somthing went wrong while uploading on local server"
        );
    }
};

export { uploadFileToLocalServer };

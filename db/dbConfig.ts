import { DB_NAME } from "@/constants";
import mongoose from "mongoose";

const dbConfig = async () => {
    try {
        const connectionIntance = await mongoose.connect(
            `${process.env.NEXT_PUBLIC_MONGODB_URI}/${DB_NAME}`
        );
        console.log(`MongoDB connected !! db host : ${connectionIntance.connection.host}`);
    } catch (error) {
        console.log(`MongoDB error`, error);
        process.exit(1)
    }
};


export {dbConfig}
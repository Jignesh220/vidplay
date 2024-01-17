import { ApiError } from "@/utils/ApiError";
import { NextRequest,NextResponse } from "next/server";

const signUp = async(req:NextRequest) =>{
    try {
        
    } catch (error:any) {
        return NextResponse.json({error: error},{status: 400})
    }
}
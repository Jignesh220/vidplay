import mongoose, { Schema, model } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String, //link
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    discreaption: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

export const Video = model("Video", videoSchema);

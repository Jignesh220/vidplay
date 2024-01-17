import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String, // 3rd party link
            required: true,
        },
        coverImage: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            email: this.email,
            userName: this.userName,
        },
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);

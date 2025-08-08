import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import { Schema, type Document, type Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    fullname: string;
    email: string;
    password: string;
    refreshToken?: string;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userSchema.pre("save", async function(next){
    if(!(this.isModified('password'))) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (userPassword: string) {
    return await bcrypt.compare(userPassword, this.password);
}

export const User = mongoose.model<IUser>("User", userSchema);
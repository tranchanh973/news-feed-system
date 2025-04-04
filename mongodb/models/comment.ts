import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models } from "mongoose";

// for the client side
export interface ICommentBase {
  user: IUser;
  text: string;
}

// For the server side
export interface IComment extends Document, ICommentBase {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", commentSchema);

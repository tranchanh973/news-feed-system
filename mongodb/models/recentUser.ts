import mongoose, { Schema, Document } from "mongoose";

export interface IRecentUser extends Document {
  userId: string;
  lastActive: Date;
  isActive: boolean;
}

const RecentUserSchema = new Schema<IRecentUser>({
  userId: { type: String, required: true },
  lastActive: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

export const RecentUser =
  mongoose.models.RecentUser ||
  mongoose.model<IRecentUser>("RecentUser", RecentUserSchema);

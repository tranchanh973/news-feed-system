"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectdb } from "@/mongodb/db";
import { put } from "@vercel/blob";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;

  if (!postInput) {
    throw new Error("Post input is required");
  }

  // Define user
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    // Kết nối đến MongoDB
    await connectdb();

    // Nếu có ảnh, chuyển đổi thành Buffer
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());

      // Tải ảnh lên Blob Storage
      const result = await put(`posts/${Date.now()}-${image.name}`, buffer, {
        contentType: image.type,
        access: "public", // or "private" based on your requirements
      });

      imageUrl = result.url;
    }

    // Tạo bài viết trong cơ sở dữ liệu
    const body = {
      user: userDB,
      text: postInput,
      ...(imageUrl && { imageUrl }),
    };

    await Post.create(body);

    // Revalidate the path to ensure the post appears on the homepage
    await revalidatePath("/");
  } catch (error: any) {
    console.error("Failed to create post:", error);
    throw new Error("Failed to create post: " + error.message);
  }
}

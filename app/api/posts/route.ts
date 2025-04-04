import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl?: string | null;
}

export async function POST(request: Request) {
  auth().protect(); //protect the route

  try {
    connectDB(); //connect to the database

    const { user, text, imageUrl }: AddPostRequestBody = await request.json(); //get the data from the request body

    const postData: IPostBase = {
      user,
      text,
      ...(imageUrl && { imageUrl }),
    };
    const post = await Post.create(postData); //create a new post
    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create post ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB(); //connect to the database

    const posts = await Post.getAllPosts(); //fetch all posts
    return NextResponse.json({ posts }); //return posts as json
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

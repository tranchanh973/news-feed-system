import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
// import Widget from "@/components/Widget";
import { Post } from "@/mongodb/models/post";
import UserInformation from "@/components/UserInformation";
import { SignedIn } from "@clerk/nextjs";
import { User } from "lucide-react";
import connectDB from "@/mongodb/db";

export const revalidate = 0;

export default async function Home() {
  await connectDB();
  const posts = await Post.getAllPosts();

  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      {/* <section className="hidden md:inline md:col-span-2"> */}
      <section className="hidden md:inline md:col-span-2 xl:col-span-2">
        <UserInformation posts={posts} />
      </section>

      {/* <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full"> */}
      <section className="col-span-full md:col-span-6 xl:col-span-8 xl:col-start-3 mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>
        <PostFeed posts={posts} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2">
        {/* <Widget /> */}
      </section>
    </div>
  );
}

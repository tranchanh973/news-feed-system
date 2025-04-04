import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import Widget from "@/components/Widget";
import { Post } from "@/mongodb/models/post";
import UserInformation from "@/components/UserInformation";
import { SignedIn } from "@clerk/nextjs";
import { connectdb } from "@/mongodb/db";

export const revalidate = 0;

export default async function Home() {
  await connectdb();
  const posts = await Post.getAllPosts();

  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      {/* Section 1: User Information */}
      <section className="hidden md:inline md:col-span-2 xl:col-span-2">
        <UserInformation posts={posts} />
      </section>

      {/* Section 2: Post Form and Feed */}
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:col-start-3 mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>
        <PostFeed posts={posts} />
      </section>

      {/* Section 3: Widget */}
      <section className="hidden xl:inline justify-center col-span-2 ml-6">
        <Widget />
      </section>
    </div>
  );
}

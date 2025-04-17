"use client";

import createCommentAction from "@/actions/createCommentAction";
import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    ref.current?.reset();

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      await createCommentActionWithPostId(formData);
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
      toast.error("Error creating comment");
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(ref.current!);
        const commentInput = formData.get("commentInput") as string;

        //Check input empty before calling toast.promise
        if (!commentInput || commentInput.trim() === "") {
          toast.error("Comment cannot be empty!");
          return;
        }

        const promise = handleCommentAction(formData);
        toast.promise(promise, {
          loading: "Posting comment...",
          success: "Comment Posted!",
          error: "Error creating comment",
        });
      }}
      className="flex items-center space-x-1"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
        />
        <button type="submit" hidden>
          Comment
        </button>
      </div>
    </form>
  );
}

export default CommentForm;

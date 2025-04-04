"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useUser();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePostAction = async (formData: FormData) => {
    const formDataTmp = formData;
    ref.current?.reset(); // Reset the form after submission

    const text = formDataTmp.get("postInput") as string;
    if (!text.trim()) {
      throw new Error("You must provide a post input");
    }

    setPreview(null); // Reset the preview after submission

    try {
      await createPostAction(formDataTmp);
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  return (
    <div className="mb-2">
      <form
        ref={ref}
        action={(formData: FormData) => {
          // Handle form submission logic here
          const promise = handlePostAction(formData);

          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created",
            error: "Failed to create post",
          });
        }}
        className="p-3 bg-white rounded-lg border"
      >
        {/* Input row */}
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button type="submit" hidden>
            Post
          </button>
        </div>

        {/* Preview conditional check */}
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="Preview" className="w-full object-cover" />
          </div>
        )}

        {/* Buttons row */}
        <div className="flex justify-end mt-2 space-x-2">
          {/* Add/Change Image button */}
          <Button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change" : "Add"} image
          </Button>

          {/* Remove Image button */}
          {preview && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setPreview(null);
              }}
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove Image
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PostForm;

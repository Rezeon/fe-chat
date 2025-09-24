
import { PostContent } from "../components/posts/post.content";
import { PostInput } from "../components/posts/post.posting";

export function PostPage() {
  return (
    <div className="flex flex-col w-full h-screen relative">
      <div className="flex-1 overflow-y-auto flex flex-col items-center p-4 mb-10">
        <PostContent />
      </div>

      <div className="border-t bg-white shadow">
        <PostInput />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          setPosts((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  }

  async function createFakePost() {
    const score = Math.floor(Math.random() * 40) + 60;

    await supabase.from("posts").insert({
      username: "@martin",
      score,
      tier: score > 90 ? "Nuclear Grade" : "Thunderclass",
    });
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-6xl font-bold mb-8">FARTER</h1>

      <button
        onClick={createFakePost}
        className="bg-white text-black px-6 py-4 rounded-2xl mb-10"
      >
        DROP AUDIO
      </button>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-white/10 rounded-3xl p-6 bg-zinc-900"
          >
            <div className="text-xl">{post.username}</div>

            <div className="mt-2 text-5xl font-bold">
              {post.score}
            </div>

            <div className="text-zinc-400 mt-1">
              {post.tier}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//INFO:useEffect や useState などの クライアントサイドの機能 を使う場合は、ファイルの先頭に'use client'の記述が必要。
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Post } from './_types/Post';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const postsFetch = async () => {
      setIsLoading(true);
      //  GETリクエストを http://localhost:3000/api/posts に送信（ローカル開発時）
      const res = await fetch('/api/posts');
      const { posts } = await res.json();
      console.log('API response:', posts);
      setPosts(posts);
      setIsLoading(false);
    };

    postsFetch();
  }, []);

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <>
      <div className="my-10 mx-6">
        <ul className="flex flex-col gap-10">
          {posts.map((post) => {
            return (
              <li key={post.id} className="border p-4">
                <Link href={`/posts/${post.id}`}>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {post.postCategories.map((pc) => {
                        return (
                          <div
                            key={pc.category.id}
                            className="border border-blue-500 rounded text-blue-500 text-sm px-2 py-1"
                          >
                            {pc.category.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <h1 className="text-2xl mt-2 mb-4">{post.title}</h1>
                  <p
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

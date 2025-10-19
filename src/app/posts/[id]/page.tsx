'use client';
/*  INFO: page.tsx はファイル名ベースでルーティングされる（動的ルーティング）仕組みの一部
 ディレクトリ構造がそのままURLパスになる
[id] のように [] を使うと動的ルーティングになり、URLの一部を変数として受け取れる */
import { Post } from '@/app/_types/Post';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [post, setPost] = useState<Post | null>(null);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);

  useEffect(() => {
    const postFetch = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        const { post } = await res.json();
        setPost(post);
      } catch (error) {
        console.error(error);
        setError('記事の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    postFetch();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>読み込み中...</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <>
      <div className="my-14 mx-6">
        {thumbnailImageUrl && (
          <div className="flex max-w-full">
            <Image src={thumbnailImageUrl} alt="" height={1000} width={1000} />
          </div>
        )}
        <div className="flex justify-between pt-4">
          <div className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            {post.postCategories.map((postCategory) => {
              return (
                <div
                  key={postCategory.category.id}
                  className="border border-blue-500 rounded text-blue-500 text-sm px-2 py-1"
                >
                  {postCategory.category.name}
                </div>
              );
            })}
          </div>
        </div>
        <h1 className="text-2xl mt-2 mb-4">{post.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </>
  );
}

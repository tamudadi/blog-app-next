import { PostInputs } from '@/app/_types/PostInputs';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid'; // 固有のIDを生成するライブラリ
import { CategoriesSelect } from './CategoriesSelect';

interface PostFormProps {
  mode: 'new' | 'edit';
  onSubmit: (data: PostInputs) => Promise<void>;
  onDelete?: () => void;
  //親から初期値を受け取る
  defaultValues?: PostInputs;

  // 以下のpropsはRHF導入に伴い不要になった
  // title: string;
  // setTitle: (title: string) => void;
  // content: string;
  // setContent: (content: string) => void;
  // thumbnailImageKey: string;
  // setThumbnailImageKey: (url: string) => void;
  // categories: Category[];
  // setCategories: (categories: Category[]) => void;
  // isSubmitting: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  mode,
  onSubmit,
  onDelete,
  defaultValues,
  // title,
  // setTitle,
  // content,
  // setContent,
  // thumbnailImageKey,
  // setThumbnailImageKey,
  // categories,
  // setCategories,
  // isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<PostInputs>({
    defaultValues: defaultValues ?? {
      title: '',
      content: '',
      thumbnailImageKey: '',
      categories: [],
    },
  });

  // ★ defaultValuesの変更を検知してフォームをリセット
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  //サムネイルURLの監視
  const thumbnailImageKey = watch('thumbnailImageKey');
  useEffect(() => {
    if (!thumbnailImageKey) return;

    // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length == 0) {
      //画像が選択されていない場合はreturn
      return;
    }

    const file = e.target.files[0]; // 選択された画像を取得

    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    //RHFの値を更新
    setValue('thumbnailImageKey', data.path);
    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    // setThumbnailImageKey(data.path);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'タイトルは必須です' })}
          disabled={isSubmitting}
          className="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          {...register('content', { required: '本文を入力してください' })}
          disabled={isSubmitting}
          className="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full border border-gray-300 rounded-md p-3"
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="categories"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={watch('categories')}
          setSelectedCategories={(newCategories) =>
            setValue('categories', newCategories)
          }
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="py-2 px-4 border-transparent rounded-md bg-blue-500 text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:opacity-50"
      >
        {mode === 'new' ? '作成' : '更新'}{' '}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          disabled={isSubmitting}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2 disabled:bg-gray-100 disabled:opacity-50"
          onClick={onDelete}
        >
          削除
        </button>
      )}
    </form>
  );
};

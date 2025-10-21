'use client';

import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert('メールアドレスまたはパスワードが正しくありません。');
      return;
    }
    ('ログインしました');
    //errorプロパティがなければ/admin/postsへ
    router.replace('/admin/posts');
  };

  return (
    <div className="flex justify-center pt-[240px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-[400px]"
      >
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          メールアドレス
        </label>
        <input
          type="email"
          placeholder="name@company.com"
          {...register('email', {
            required: true,
            pattern: /^\S+@\S+$/i,
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            メールアドレスを正しく入力してください
          </p>
        )}

        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          パスワード
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register('password', { required: true, minLength: 6 })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">
            パスワードは6文字以上で入力してください
          </p>
        )}
        <input
          type="submit"
          disabled={isSubmitting}
          value={isSubmitting ? 'ログイン中...' : 'ログイン'}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        />
      </form>
    </div>
  );
}

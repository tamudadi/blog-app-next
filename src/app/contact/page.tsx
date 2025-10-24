'use client';
import { useForm } from 'react-hook-form';

/* INFO: page.tsx は Next.js のルーティング対象になる特殊ファイル
ページとして機能させるために default export の React コンポーネントが必須
これがないと Next.js がページとして認識できずエラーになる */

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContactForm>();

  //フォームの送信
  const onSubmit = async (data: ContactForm) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const res = await fetch(
        'https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts',
        params
      );
      if (!res.ok) {
        throw new Error(`HTTPエラー: ${res.status}`);
      }

      alert('送信しました');
      reset();
    } catch (error) {
      alert(`送信に失敗しました。${error}`);
    }
  };

  return (
    <>
      <div className="max-w-[800px] mx-auto py-10">
        <h1 className="font-bold text-xl mb-10">問い合わせフォーム</h1>
        <form className="gap-6 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center w-full ">
            <label htmlFor="name" className="w-[240px]">
              お名前
            </label>
            <div className="w-full">
              <input
                className="p-4 border border-gray-300 rounded w-full"
                type="text"
                id="name"
                {...register('name', {
                  required: 'お名前は必須です',
                  maxLength: {
                    value: 30,
                    message: 'お名前は30文字以内で入力してください',
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-700">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center w-full ">
            <label htmlFor="email" className="w-[240px]">
              メールアドレス
            </label>
            <div className="w-full">
              <input
                className="p-4 border border-gray-300 rounded w-full"
                type="email"
                id="email"
                {...register('email', {
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '正しいメールアドレスの形式で入力してください',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-700">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center w-full ">
            <label htmlFor="message" className="w-[240px]">
              本文
            </label>
            <div className="w-full">
              <textarea
                className="p-4 border border-gray-300 rounded w-full"
                id="message"
                rows={8}
                {...register('message', {
                  required: '本文は必須です',
                  maxLength: {
                    value: 500,
                    message: '本文は500文字以内で入力してください',
                  },
                })}
              />
              {errors.message && (
                <p className="text-red-700">{errors.message.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="rounded-lg bg-gray-800 text-white font-bold py-2 px-4"
              type="submit"
              disabled={isSubmitting}
            >
              送信
            </button>
            <button
              className="rounded-lg bg-gray-300 font-bold py-2 px-4"
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              クリア
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

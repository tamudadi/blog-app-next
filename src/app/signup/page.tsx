'use client';

import { supabase } from '@/utils/supabase';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

export default function Page() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  //const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // isSubmittingは自動でtrue/false切り替わる（自分でset不要）
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: `http://localhost:3000/login` },
    });

    if (error) {
      alert(`登録に失敗しました: ${error.message}`);
      return;
    }

    alert('確認メールを送信しました。');
    // 入力欄をリセット
    reset();
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
          value={isSubmitting ? '登録中...' : '登録'}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        />
      </form>
    </div>
  );
  //   const onSubmit = (data) => console.log(data);
  //   console.log(errors);

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);

  //     try {
  //       const { error } = await supabase.auth.signUp({
  //         email,
  //         password,
  //         options: { emailRedirectTo: `http://localhost:3000/login` },
  //       });

  //       if (error) {
  //         alert(`登録に失敗しました:${error.message}`);
  //         return;
  //       }

  //       //エラープロパティがなければ
  //       setEmail('');
  //       setPassword('');
  //       alert('確認メールを送信しました。');
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  //   return (
  //     <div className="flex justify-center pt-[240px]">
  //       <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[400px]">
  //         <div>
  //           <label
  //             htmlFor="email"
  //             className="block mb-2 text-sm font-medium text-gray-900"
  //           >
  //             メールアドレス
  //           </label>
  //           <input
  //             type="email"
  //             name="email"
  //             id="email"
  //             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //             placeholder="name@company.com"
  //             required
  //             onChange={(e) => setEmail(e.target.value)}
  //             value={email}
  //           />
  //         </div>
  //         <div>
  //           <label
  //             htmlFor="password"
  //             className="block mb-2 text-sm font-medium text-gray-900"
  //           >
  //             パスワード
  //           </label>
  //           <input
  //             type="password"
  //             name="password"
  //             id="password"
  //             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //             placeholder="••••••••"
  //             required
  //             onChange={(e) => setPassword(e.target.value)}
  //             value={password}
  //           />
  //         </div>

  //         <div>
  //           <button
  //             type="submit"
  //             disabled={isSubmitting}
  //             className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
  //           >
  //             {isSubmitting ? '登録中....' : '登録'}
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   );
  //
}

import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-[#333] text-white flex justify-between p-6 font-bold">
      <Link href="/">Blog</Link>
      <Link href="/contact">お問い合わせ</Link>
    </header>
  );
};

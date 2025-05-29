/* INFO: page.tsx は Next.js のルーティング対象になる特殊ファイル
ページとして機能させるために default export の React コンポーネントが必須
これがないと Next.js がページとして認識できずエラーになる */
export default function page() {
  return <div>お問い合わせ</div>;
}

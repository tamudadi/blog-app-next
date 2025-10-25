import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { Category } from '@/app/_types/Category';
import React from 'react';
import { useFetch } from '../../_hooks/useFetch';

interface Props {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [open, setOpen] = React.useState(false);
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useFetch<{ categories: Category[] }>(
    '/api/admin/categories'
  );
  const categories = data?.categories ?? [];

  const handleChange = (id: number) => {
    const isSelect = selectedCategories.some((c) => c.id === id);
    if (isSelect) {
      setSelectedCategories(selectedCategories.filter((c) => c.id !== id));
      return;
    }
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    setSelectedCategories([...selectedCategories, category]);
  };

  if (error) {
    return <div>カテゴリーの取得に失敗しました。</div>;
  }
  if (isLoading) {
    return <div>カテゴリーを読み込み中...</div>;
  }

  return (
    <div className="w-full relative">
      <button
        type="button"
        className="w-full border border-gray-300 rounded px-3 py-2 bg-white flex flex-wrap gap-2 min-h-[42px] focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedCategories.length === 0 && (
          <span className="text-gray-400">カテゴリを選択</span>
        )}
        {selectedCategories.map((value) => (
          <span
            key={value.id}
            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-1 mb-1"
          >
            {value.name}
            <button
              type="button"
              className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategories(
                  selectedCategories.filter((c) => c.id !== value.id)
                );
              }}
            >
              ×
            </button>
          </span>
        ))}
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 flex items-center ${
                selectedCategories.some((c) => c.id === category.id)
                  ? 'bg-blue-100'
                  : ''
              }`}
              onClick={() => handleChange(category.id)}
            >
              <input
                type="checkbox"
                checked={selectedCategories.some((c) => c.id === category.id)}
                readOnly
                className="mr-2"
              />
              {category.name}
            </li>
          ))}
        </ul>
      )}
      {/* 背景クリックで閉じる */}
      {open && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

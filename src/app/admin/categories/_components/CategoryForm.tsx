import React, { useState } from 'react';

interface CategoryFormProps {
  mode: 'new' | 'edit';
  name: string;
  setName: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー名
        </label>
        <input
          type="text"
          id="title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:opacity-50"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isSubmitting}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2 disabled:bg-gray-100 disabled:opacity-50"
        >
          削除
        </button>
      )}
    </form>
  );
};

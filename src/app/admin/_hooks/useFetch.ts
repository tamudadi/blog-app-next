// src/app/_hooks/useFetch.ts
'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import useSWR from 'swr';

export const useFetch = <T>(endpoint: string) => {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string): Promise<T> => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
    });

    if (!res.ok) {
      throw new Error(`データの取得に失敗しました: ${res.status}`);
    }

    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR<T>(
    token ? [endpoint, token] : null,
    fetcher
  );

  return { data, error, isLoading, mutate };
};

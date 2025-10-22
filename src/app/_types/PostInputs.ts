import { Category } from '@/app/_types/Category';

export interface PostInputs {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
}

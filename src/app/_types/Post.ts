import { Category } from './Category';

export interface Post {
  id: number;
  title: string;
  thumbnailImageKey: string;
  createdAt: string;
  postCategories: {
    category: Category;
  }[];
  content: string;
}

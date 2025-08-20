export type TArticleCategory = {
  id: number;
  name: string;
};
export type TArticle = {
  id: number;
  uuid: string;
  category_id: number;
  slug: string;
  title: string;
  content: string;
  images: TArticleImage[];
  created_at: string;
  category: TArticleCategory;
};
export type TArticleImage = {
  id: number;
  article_id: number;
  url: string;
};

export type TResponseMeta<T = any> = {
  data: T;
  message: string;
  status: number;
};

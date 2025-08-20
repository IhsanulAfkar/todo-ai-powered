'use client';
import { RichTextRender } from '@/components/default/RichTextRender';
import { TArticle } from '@/types';
import { NextPage } from 'next';

interface Props {
  article: TArticle;
}

const DetailArticlePage: NextPage<Props> = ({ article }) => {
  return (
    <div>
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <p className="text-3xl font-bold">{article?.title}</p>
        <p>{article?.category.name}</p>
        <RichTextRender html={article?.content ?? ''} />
      </div>
    </div>
  );
};

export default DetailArticlePage;

'use client';
import LoadingIndicator from '@/components/default/LoadingIndicator';
import { RichTextRender } from '@/components/default/RichTextRender';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import usePublicArticles from '@/hooks/public/usePublicArticles';
import { useRouter } from '@bprogress/next/app';
import { NextPage } from 'next';

const ArticlePage: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = usePublicArticles();
  if (isLoading) return <LoadingIndicator />;
  return (
    <>
      <div className="mx-auto my-12 flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <p className="text-center text-4xl font-bold text-gray-900 dark:text-white">
          Articles
        </p>
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {data.map((item) => (
            <Card
              key={item.id}
              className="flex h-30 flex-row items-center gap-2 overflow-hidden p-0 transition-transform duration-100 hover:scale-[102%] hover:cursor-pointer md:h-40"
              onClick={() => router.push('/articles/' + item.slug)}
            >
              {/* Left Image */}
              <div className="h-40 w-40 flex-shrink-0">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt="Card Image"
                    className="h-full w-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = 'https://picsum.photos/300/300')
                    }
                  />
                ) : (
                  <img
                    src="https://picsum.photos/300/300"
                    alt="Card Image"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Right Content */}
              <div className="flex h-full w-full flex-col justify-between py-2">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.category.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RichTextRender
                    html={item.content}
                    className="h-12 max-w-full overflow-hidden text-xs"
                    limit={80}
                  />
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticlePage;

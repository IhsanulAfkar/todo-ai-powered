'use client';
import CircularProgress from '@/components/progress-09';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SOCKET_EMIT_TYPES, SOCKET_TYPE_LABEL } from '@/lib/constant';
import { useSocket } from '@/providers/SocketProvider';
import { TSocketData } from '@/types/socket';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const BackgroundProcessBar: NextPage = () => {
  const { isConnected, off, on, socket, emit } = useSocket();
  const [isShowing, setIsShowing] = useState(false);
  const [open, setOpen] = useState(true);
  const [rawTimeline, setRawTimeline] = useState<TSocketData | undefined>();
  const [comment, setComment] = useState<TSocketData | undefined>();
  const [topicModelling, setTopicModelling] = useState<
    TSocketData | undefined
  >();
  const [hateSpeech, setHateSpeech] = useState<TSocketData | undefined>();
  const [spamDetection, setSpamDetection] = useState<TSocketData | undefined>();
  const [sentiment, setSentiment] = useState<TSocketData | undefined>();
  const [news, setNews] = useState<TSocketData | undefined>();
  const [postLink, setPostLink] = useState<
    { status: boolean; message: string } | undefined
  >();
  const updateState = (input: string, data?: TSocketData) => {
    switch (input) {
      case 'social_media':
        setRawTimeline(data);
        break;
      case 'news':
        setNews(data);
        break;
      case 'topic_modeling':
        setTopicModelling(data);
        break;
      case 'sentiment':
        setSentiment(data);
        break;
      case 'hate_speech':
        setHateSpeech(data);
        break;
      case 'spam':
        setSpamDetection(data);
        break;
      case 'comment':
        setComment(data);
        break;

      default:
        return null;
        break;
    }
  };
  useEffect(() => {
    if (socket && isConnected) {
      SOCKET_EMIT_TYPES.forEach((item) => {
        on(`${item}`, (data) => {
          if (data && data.total) {
            updateState(item, { ...data, type: item });
          } else {
            updateState(item);
          }
        });
      });

      on('link', (data: any) => {
        if (data) setPostLink(data);
      });
    }
    return () => {
      SOCKET_EMIT_TYPES.forEach((item) => {
        off(`${item}`);
      });
      off('link');
    };
  }, [socket, isConnected]);
  useEffect(() => {
    setIsShowing(
      [
        rawTimeline,
        news,
        topicModelling,
        spamDetection,
        hateSpeech,
        sentiment,
        postLink,
        comment,
      ].some((v) => v !== undefined || (v as any)?.status),
    );
  }, [
    rawTimeline,
    news,
    topicModelling,
    spamDetection,
    hateSpeech,
    sentiment,
    postLink,
    comment,
  ]);
  useEffect(() => {
    emit(`status`, () => {});
    const interval = setInterval(() => {
      emit(`status`, () => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [socket]);
  if (!isShowing) return <></>;
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50">
      <div className="pointer-events-auto w-40 rounded-lg border bg-white px-4 py-2 shadow-lg md:w-96">
        <Collapsible open={open} onOpenChange={(e) => setOpen(e)}>
          <CollapsibleTrigger asChild>
            <Button variant={'ghost'} className="h-8 w-full justify-start px-0">
              <div className="flex w-full justify-between">
                <p className="text-gray-90 font-bold">Background Process</p>
                {open ? <ChevronUp /> : <ChevronDown />}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1 flex flex-col gap-2">
              {postLink && (
                <div className="flex items-center">
                  <p className="py-1 text-sm font-semibold">
                    {postLink.message}
                  </p>
                </div>
              )}

              {[
                rawTimeline,
                news,
                topicModelling,
                spamDetection,
                hateSpeech,
                sentiment,
                comment,
              ]
                .filter((item) => item !== undefined)
                .map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CircularProgress
                      value={
                        item.total != 0
                          ? Math.floor((item.ongoing / item.total) * 100)
                          : 0
                      }
                      size={60}
                      strokeWidth={4}
                      showLabel
                      labelClassName="text-xs font-semibold"
                      renderLabel={(progress) => `${progress}%`}
                      className="stroke-blue-300/25"
                      progressClassName="stroke-blue-700"
                    />
                    <p className="text-sm font-semibold">
                      {SOCKET_TYPE_LABEL[item.type]} : {item.ongoing}/
                      {item.total}{' '}
                      {item.type === 'social_media' ? 'Batch' : 'Data'} Diproses
                    </p>
                  </div>
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default BackgroundProcessBar;

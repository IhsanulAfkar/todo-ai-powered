import React from 'react';
import { cn } from '@/lib/utils'; // shadcn's cn helper

interface Props {
  html: string;
  limit?: number;
  className?: string;
}

export function RichTextRender({ html, limit, className }: Props) {
  // Strip tags to measure plain text length
  const plainText = html.replace(/<[^>]+>/g, '');

  let truncatedHtml = html;

  if (limit && plainText.length > limit) {
    const truncatedText = plainText.substring(0, limit) + '...';
    truncatedHtml = `<span>${truncatedText}</span>`;
  }

  return (
    <div
      className={cn('prose dark:prose-invert max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: truncatedHtml }}
    />
  );
}

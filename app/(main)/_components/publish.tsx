'use client';

import { Doc } from '@/convex/_generated/dataModel';
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from '@/components/ui/popover';
import useOrigin from '@/hooks/useOrigin';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { set } from 'zod';
import { init } from 'next/dist/compiled/webpack/webpack';
import { Check, Copy, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublishProps {
  initialData: Doc<'documents'>;
}

const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: '笔记发布中...',
      success: '笔记发布成功',
      error: '笔记发布失败',
    });
  };

  const onUnPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: '笔记取消发布中...',
      success: '笔记取消发布',
      error: '笔记取消发布失败',
    });
  };

  const onCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          公开
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72"
        align="end"
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-publse w-4 h-4" />
              <p className="text-xs font-medium text-sky-500">
                此笔记已公开互联网
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                className="flex-1 px-2 text-xs border rounded-l-md h-8
              bg-muted truncate"
              />
              <Button
                onClick={onCopyUrl}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              onClick={onUnPublish}
              disabled={isSubmitting}
              className="w-full text-xs"
            >
              取消公开
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">
              公开此笔记
            </p>
            <span className="text-xs text-muted-foreground mb-4">
              开启后，互联网所有人可访问
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              公开
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;

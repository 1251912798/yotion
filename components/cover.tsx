'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { ImageIcon, X } from 'lucide-react';
import { useCoverImage } from '@/hooks/useCoverImage';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useEdgeStore } from '@/lib/edgestore';
import { Skeleton } from '@/components/ui/skeleton';

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(
    api.documents.reomveCoverImage
  );

  const onRemove = () => {
    if (url) {
      edgestore.publicFiles.delete({
        url: url,
      });
    }

    removeCoverImage({
      id: params.documentId as Id<'documents'>,
    });
  };

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && (
        <Image
          src={url}
          fill
          alt="封面"
          className="object-cover"
        />
      )}
      {url && !preview && (
        <div
          className="opacity-0 group-hover:opacity-100 absolute
        bottom-5 right-5 flex items-center gap-x-2"
        >
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            更换封面
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            删除封面
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};

export default Cover;

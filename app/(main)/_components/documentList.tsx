'use client';

import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { Id, Doc } from '@/convex/_generated/dataModel';

import Item from './item';

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>;
  level?: number;
  data?: Doc<'documents'>[];
}

const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<
    Record<string, boolean>
  >({});

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  // 重定向
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (document === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level
            ? `${level * 12 + 25}px`
            : undefined,
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
      >
        这里没有页面
      </p>
      {documents?.map(item => {
        const { _id, title, icon } = item;
        return (
          <div key={_id}>
            <Item
              id={_id}
              onClick={() => onRedirect(_id)}
              label={title}
              icon={FileIcon}
              documentIcon={icon}
              active={params.documentId === _id}
              level={level}
              onExpand={() => onExpand(_id)}
              expanded={expanded[_id]}
            />
            {expanded[_id] && (
              <DocumentList
                parentDocumentId={_id}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default DocumentList;

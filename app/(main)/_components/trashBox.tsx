'use client';

import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Search, Trash, Undo } from 'lucide-react';

import { Id } from '@/convex/_generated/dataModel';
import { Spinner } from '@/components/spinner';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/modals/confirmModal';

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState('');

  // 过滤搜索的文档
  const filterDocuments = documents?.filter(item => {
    return item.title
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  // 恢复
  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: '恢复中...',
      success: '恢复成功',
      error: '恢复失败',
    });
  };

  // 彻底删除
  const onRemove = (documentId: Id<'documents'>) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: '删除中...',
      success: '删除成功!',
      error: '删除失败!',
    });

    if (params.documentId === documentId) {
      router.push('/documents');
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-2 h-7 focus-visible:ring-transparent bg-secondary"
          placeholder="按页面标题筛选"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p
          className="hidden last:block text-xs text-center
          text-muted-foreground pb-2"
        >
          未找到文档
        </p>
        {filterDocuments?.map(document => (
          <div
            key={document._id}
            className="text-sm rounded-sm w-full hover:bg-primary/5
              flex items-center text-primary justify-between
            "
            role="button"
            onClick={() => onClick(document._id)}
          >
            <span className="truncate pl-2">
              {document.title}
            </span>
            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                role="button"
                onClick={e => onRestore(e, document._id)}
              >
                <Undo className="w-4 h-4 text-muted-foreground" />
              </div>
              <ConfirmModal
                onConfirm={() => onRemove(document._id)}
              >
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="w-4 h-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;

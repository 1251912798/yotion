'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/modals/confirmModal';

interface BannerProps {
  documentId: Id<'documents'>;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: '笔记删除中...',
      success: '笔记删除成功',
      error: '笔记删除失败',
    });
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: '笔记恢复中...',
      success: '笔记恢复成功',
      error: '笔记恢复失败',
    });
  };

  return (
    <div
      className="w-full bg-red-500 text-center text-sm
      p-2 text-white flex items-center gap-x-2 justify-center
    "
    >
      <p>回收站</p>
      <Button
        onClick={onRestore}
        size="sm"
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5
          text-white hover:text-white p-1 px-2 h-auto font-normal
        "
      >
        恢复笔记
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5
          text-white hover:text-white p-1 px-2 h-auto font-normal
        "
        >
          永久删除
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;

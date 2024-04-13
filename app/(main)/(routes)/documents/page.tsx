'use client';

import Image from 'next/image';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  // 创建笔记
  const onCreate = () => {
    const promise = create({ title: '未命名标题' }).then(
      documentId => router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: '创建笔记中...',
      success: '创建笔记成功!',
      error: '创建笔记失败.',
    });
  };

  return (
    <div
      className="h-full flex flex-col
    items-center justify-center space-y-4"
    >
      <Image
        src="/empty.png"
        width="300"
        height="300"
        alt="Empyt"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        width="300"
        height="300"
        alt="Empyt"
        className="hidden dark:block"
      />
      <h2>欢迎使用{user?.firstName}的 Yotion</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        创建笔记
      </Button>
    </div>
  );
};

export default DocumentsPage;

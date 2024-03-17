'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';

import { SingleImageDropzone } from '@/components/upload';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/useCoverImage';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const CoverImageModal = () => {
  const upadate = useMutation(api.documents.update);
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      await upadate({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog
      open={coverImage.isOpen}
      onOpenChange={coverImage.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            封面图片
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;

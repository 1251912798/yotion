'use client';

import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface TitleProps {
  initialData: Doc<'documents'>;
}

const Title = ({ initialData: document }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.documents.update);

  const [title, setTitle] = useState(
    document.title || '未命名标题'
  );
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(document.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(
        0,
        inputRef.current.value.length
      );
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
    update({
      id: document._id,
      title: event.target.value || '未命名标题',
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!document.icon && <p>{document.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          onBlur={disableInput}
          className="px-2 h-7 focus-visible:ring-transparent"
        ></Input>
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{document.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="w-20 h-9 rounded-md" />;
};

export default Title;

'use client';
import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { ImageIcon, Smile, X } from 'lucide-react';
import TextareaAuto from 'react-textarea-autosize';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import IconPicker from './iconPicker';
import { Button } from './ui/button';

import type { ElementRef } from 'react';
import { useCoverImage } from '@/hooks/useCoverImage';

interface ToolbarProps {
  initialData: Doc<'documents'>;
  preview?: boolean;
}

const Toolbar = ({
  initialData,
  preview,
}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const coverImage = useCoverImage();

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  // 开启编辑标题
  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  // 失焦关闭编辑标题
  const disableInput = () => setIsEditing(false);

  // 输入标题
  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || '未命名标题',
    });
  };

  // 回车关闭编辑标题
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };

  // 选择图标
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  // 删除图标
  const onRemoveIcon = () => {
    removeIcon({ id: initialData._id });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition
              text-muted-foreground text-xs
            "
            variant="outline"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-100 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="w-4 h-4 mr-2" />
              添加图标
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            size="sm"
            className="text-muted-foreground text-xs"
            variant="outline"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            添加封面
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAuto
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={e => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none
            text-[#3F3F3F] dark:text-[#CFCFCF] resize-none
          "
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words
          outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;

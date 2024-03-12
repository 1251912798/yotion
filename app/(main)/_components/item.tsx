'use client';

import { useMutation } from 'convex/react';
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  Plus,
  MoreHorizontal,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;

  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const onArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!id) return;
    const promise = archive({ id });

    toast.promise(promise, {
      loading: '删除中...',
      success: '删除成功,移至回收站!',
      error: '删除失败!',
    });
  };

  const handeleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };
  // 创建文件
  const onCreate = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = create({
      title: '未命名标题',
      parentDocument: id,
    }).then(documentId => {
      if (!expanded) {
        onExpand?.();
      }
      // router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: '创建笔记中...',
      success: '创建笔记成功!',
      error: '创建笔记失败!',
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level
          ? `${level * 12 + 12}px`
          : '12px',
      }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {/* 判断是否为操作项 */}
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={handeleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {/* 自定义了Icon就用自定义的Icon */}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>
      {/* 搜索模式 */}
      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 select-none items-center
        gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span className="text-xs">CTRL</span>K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={e => e.stopPropagation()}
              asChild
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto
                  rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600
                "
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="w-4 h-4 mr-2" />
                删除
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                最后修改：{user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto
            rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600
          "
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({
  level,
}: {
  level?: number;
}) {
  return (
    <div
      style={{
        paddingLeft: level
          ? `${level * 12 + 25}px`
          : '12px',
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="w-4 h-4" />
      <Skeleton className="w-[30%] h-4" />
    </div>
  );
};

export default Item;

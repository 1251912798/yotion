'use client';

import {
  ChevronLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import {
  ElementRef,
  useEffect,
  useRef,
  useState,
  Profiler,
  useMemo,
} from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import UserItem from './userItem';
import Item from './item';
import Navbar from './navbar';
import DocumentList from './documentList';
import TrashBox from './trashBox';
import { useSearch } from '@/hooks/useSearchContext';
import { useSettings } from '@/hooks/useSettings';

const Navigation = () => {
  const params = useParams();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const search = useSearch();
  const settings = useSettings();

  const pathname = usePathname();
  // 检测是否为手机
  const isMobile = useMediaQuery('(max-width:768px)');

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      restWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  // 创建笔记
  const handleCrerte = () => {
    const promise = create({ title: '未命名标题' }).then(
      documentId => router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: '正在创建笔记...',
      success: '创建笔记成功!',
      error: '创建笔记失败.',
    });
  };

  // 鼠标按下
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // 开始改变大小
    isResizingRef.current = true;
    // 监听鼠标移动和鼠标抬起事件
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 鼠标移动
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    // 距离视口X轴边距距离
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty(
        'left',
        `${newWidth}px`
      );
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const onRender = (
    id: any,
    phase: any,
    actualDuration: any,
    baseDuration: any,
    startTime: any,
    commitTime: any,
    interactions: any
  ) => {
    console.log(1);
  };

  // 鼠标抬起
  const handleMouseUp = () => {
    isResizingRef.current = false;

    // 鼠标抬起时注销事件
    document.removeEventListener(
      'mousemove',
      handleMouseMove
    );
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // 重置宽度
  const restWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile
        ? '100%'
        : '240px';
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );
      navbarRef.current.style.setProperty(
        'left',
        isMobile ? '100%' : '240px'
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('width', '100%');
      navbarRef.current.style.setProperty('left', '0');
      setTimeout(() => setIsResetting(false));
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting &&
            'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            `h-6 w-6 text-muted-foreground rounded-sm
        hover:bg-neutral-300 dark:hover:bg-neutral-600
        absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,
            isMobile && 'opacity-100 '
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </div>
        <div>
          <UserItem />
          <Item
            label="搜索"
            icon={Search}
            onClick={search.onOpen}
            isSearch
          />

          <Item
            onClick={handleCrerte}
            label="创建文档"
            icon={PlusCircle}
          />

          <Item
            label="设置"
            icon={Settings}
            onClick={settings.onOpen}
          />
        </div>
        <div className="mt-4">
          <Profiler id="DocList" onRender={onRender}>
            <DocumentList />
          </Profiler>

          <Item
            label="创建文档"
            onClick={handleCrerte}
            icon={PlusCircle}
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="回收站" icon={Trash}></Item>
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={restWidth}
          className="opacity-0 group-hover/sidebar:opacity-100
        transition cursor-ew-resize absolute h-full w-1
         bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]',
          isResetting &&
            'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        {!!params.documentId ? (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={restWidth}
          />
        ) : (
          <nav>
            {isCollapsed && (
              <MenuIcon
                onClick={restWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;

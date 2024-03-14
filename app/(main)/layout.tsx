'use client';

import React, { ReactNode } from 'react';
import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';

import { Spinner } from '@/components/spinner';
import SearchCommand from '@/components/serchCommand';

import Navigation from './_components/navigation';
const MainLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // 加载中
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 未登录跳转首页
  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

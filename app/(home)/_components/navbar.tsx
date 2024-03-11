'use client';
import {
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import Logo from './logo';
import { ModeToggle } from '@/components/modeToggle';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import useScrollTop from '@/hooks/useScrollTop';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        'z-50 bg-background fixed top-0 dark:bg-[#1F1F1F] flex items-center w-full p-6',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />
      <div
        className="md:ml-auto md:justify-end
      justify-between w-full flex items-center gap-x-2"
      >
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                登 录
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">加入 Yotion</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/documents"
                style={{
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                进入 Yotion
              </Link>
            </Button>
          </>
        )}
        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;

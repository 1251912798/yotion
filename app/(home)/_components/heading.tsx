'use client';

import Link from 'next/link';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-4 ">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        写作、计划、分享。 人工智能就在您身边。
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Yotion 是互联的工作空间，在这里可以
        <br />
        更好、更快地工作。
      </h3>

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <>
          <Button asChild>
            <Link href="/documents">
              进入 Yotion
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </>
      )}
      {!isAuthenticated && !isLoading && (
        <>
          <SignInButton mode="modal">
            <Button asChild>
              <Link
                href="/documents"
                style={{
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                免费注册 Yotion
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </SignInButton>
        </>
      )}
    </div>
  );
};

export default Heading;

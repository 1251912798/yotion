'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Error = () => {
  return (
    <div
      className="h-full flex flex-col items-center
  justify-center space-y-4"
    >
      <Image
        src="/error.png"
        height="300"
        width="300"
        alt="错误"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        height="300"
        width="300"
        alt="错误"
        className="hidden dark:block"
      />
      <h2 className="text-xl font-medium">
        出了点错误，但问题不大
      </h2>
      <Button asChild>
        <Link href="/documents">返回</Link>
      </Button>
    </div>
  );
};

export default Error;

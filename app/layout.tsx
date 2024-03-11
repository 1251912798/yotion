import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/provider/theme-provider';

import './globals.css';
import { ClerkClientProvider } from '@/components/provider/convex.provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yotion',
  description: '克隆Notion笔记app',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme:light)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 解决  Extra attributes from the server: class,style 报错
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {/* 主题 */}
        <ClerkClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="yotion-thenme"
          >
            {children}
          </ThemeProvider>
        </ClerkClientProvider>
      </body>
    </html>
  );
}

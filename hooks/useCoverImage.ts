import { create } from 'zustand';

type coverImageStore = {
  url?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
};

export const useCoverImage = create<coverImageStore>(
  set => ({
    url: undefined,
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false, url: undefined }),
    onReplace: (url: string) => set({ isOpen: true, url }),
  })
);

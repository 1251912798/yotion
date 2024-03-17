'use client';

import { useState, useEffect } from 'react';

import SettingsModal from '../modals/settingsModal';
import CoverImageModal from '../modals/coverImageModal';

const ModalProvider = () => {
  const [isMounted, serIsMounted] = useState(false);

  useEffect(() => {
    serIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};

export default ModalProvider;

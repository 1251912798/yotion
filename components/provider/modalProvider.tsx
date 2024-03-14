'use client';

import { useState, useEffect } from 'react';
import SettingsModal from '../modals/settingsModal';

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
    </>
  );
};

export default ModalProvider;

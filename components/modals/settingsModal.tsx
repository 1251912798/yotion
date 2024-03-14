'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '../ui/label';
import { ModeToggle } from '../modeToggle';

const SettingsModal = () => {
  const { isOpen, onClose } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">我的设置</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>外观</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              自定义Yotion的外观
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

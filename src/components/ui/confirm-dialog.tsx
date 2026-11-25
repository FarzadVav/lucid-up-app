import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'accent';
  isConfirming?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

/**
 * Confirmation dialog built on React Native Reusables `Dialog`, required
 * before executing important, mutating, or destructive actions (such as edit
 * or delete).
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (isConfirming && !nextOpen) {
      return;
    }
    if (!nextOpen) {
      onCancel?.();
    }
    onOpenChange(nextOpen);
  };

  const handleConfirm = async () => {
    if (isConfirming) {
      return;
    }
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={isConfirming}
              accessibilityLabel={cancelLabel}
            >
              <Text>{cancelLabel}</Text>
            </Button>
          </DialogClose>
          <Button
            variant={confirmVariant}
            onPress={() => {
              void handleConfirm();
            }}
            disabled={isConfirming}
            accessibilityLabel={confirmLabel}
          >
            <Text>{confirmLabel}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
export type { ConfirmDialogProps };

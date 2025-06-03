import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useContext, useDeleteContext } from '../../hooks/useContext';
import { Trash2 } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { SkeletonLoader } from '@/components/SkeletonLoader';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  contextId: string;
  teamId: string;
  formId: string;
};
export function DeleteContextModal({
  onClose,
  isOpen,
  contextId,
  teamId,
  formId,
}: Props) {
  const { mutate: deleteContext, isPending: isLoading } = useDeleteContext(
    contextId,
    teamId,
    onClose
  );

  const { data: context, isPending: contextIsPending } = useContext(contextId);
  const { data: form, isPending: tableIsPending } = useForm(formId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Slett skjemautfylling</DialogTitle>
        </DialogHeader>
        <SkeletonLoader loading={contextIsPending || tableIsPending}>
          <DialogDescription className="text-base">
            Er du sikker på at du vil slette skjemautfyllingen for{' '}
            <span className="font-bold">{form?.name}</span> med navn{' '}
            <span className="font-bold">{context?.name}</span>?
          </DialogDescription>
        </SkeletonLoader>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteContext()}
            disabled={isLoading}
          >
            {isLoading ? (
              'Sletter...'
            ) : (
              <>
                <Trash2 className="size-5" />
                Slett skjemautfylling
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

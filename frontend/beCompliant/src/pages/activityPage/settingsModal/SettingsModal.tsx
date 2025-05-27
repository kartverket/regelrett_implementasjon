import React, { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangeTeamTab } from '@/pages/activityPage/settingsModal/ChangeTeamTab';
import { CopyContextTab } from '@/pages/activityPage/settingsModal/CopyContextTab';

type SettingsModalProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
};

export function SettingsModal({ open, setOpen }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && setOpen(false)}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Rediger skjemautfylling</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="team" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team">Endre team</TabsTrigger>
            <TabsTrigger value="copy">Kopier svar</TabsTrigger>
          </TabsList>

          <TabsContent value="team">
            <ChangeTeamTab setOpen={setOpen} />
          </TabsContent>

          <TabsContent value="copy">
            <CopyContextTab setOpen={setOpen} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { Loader2 } from 'lucide-react';

export const Spinner = ({ sizeClass = 'size-5' }: { sizeClass?: string }) => (
  <Loader2 className={`${sizeClass} animate-spin text-muted-foreground`} />
);

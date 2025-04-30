import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex items-center justify-center h-[100svh]">
    <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
  </div>
);

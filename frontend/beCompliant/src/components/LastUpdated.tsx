import { formatDateTime, isOlderThan } from '../utils/formatTime';
import { Button } from './ui/button';
import { RotateCw, TriangleAlert } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

type Props = {
  updated?: Date;
  submitAnswer?: (newAnswer: string, unit?: string) => void;
  value?: string | undefined;
  unitAnswer?: string;
  answerExpiry?: number | null;
  isComment?: boolean;
};

export function LastUpdated({
  updated,
  submitAnswer,
  value,
  unitAnswer,
  answerExpiry,
  isComment,
}: Props) {
  if (!updated) return null;

  return (
    <div className="flex flex-row gap-1.5 content-center justify-between">
      <div className="flex flex-row gap-1">
        {!isComment && isOlderThan(updated, answerExpiry) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TriangleAlert className="self-center" />
              </TooltipTrigger>
              <TooltipContent className="bg-primary text-primary-foreground py-1.5 px-3 rounded-md text-sm">
                <p>Svaret er utløpt, og bør oppdateres</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex flex-col">
          <p className="block text-muted-foreground text-[0.625rem]">
            Sist endret
          </p>
          <p className="block text-wrap text-foreground text-xs">
            {formatDateTime(updated)}
          </p>
        </div>
      </div>
      {!isComment && submitAnswer && (
        <Button
          aria-label="Forny svaret"
          color="black"
          variant="link"
          size="sm"
          onClick={() => {
            submitAnswer(value ?? '', unitAnswer);
          }}
          className="self-center !p-0"
        >
          <RotateCw />
          Forny svar
        </Button>
      )}
    </div>
  );
}

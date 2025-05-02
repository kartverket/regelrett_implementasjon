import { Answer } from '../../api/types';
import { formatDateTime } from '../../utils/formatTime';
import { useFetchUsername } from '../../hooks/useUser';
import { Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import { Icon } from '@kvib/react';

type Props = {
  answers: Answer[];
};

export function QuestionHistory({ answers }: Props) {
  const steps = answers.slice(-3).reverse();

  return (
    <div className="flex flex-col pb-5">
      <div className="flex items-center mb-4">
        <Clock size={22} />
        <span className="font-bold text-lg ml-2">Historikk</span>
      </div>
      {steps.length === 0 ? (
        <p>Ingen historikk finnes</p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-[3rem_1fr_1fr_1fr] w-full">
            <span className="col-start-2 font-medium">NÅR</span>
            <span className="font-medium">SVAR</span>
            <span className="font-medium">HVEM</span>
          </div>

          <div className="flex flex-col w-full min-h-[300px]">
            {steps.map((answer, index) => (
              <QuestionHistoryStep
                key={answer.questionId + answer.answer + index}
                answer={answer}
                opacity={index === 0 ? 1 : 0.6}
                index={index}
              />
            ))}
          </div>

          <Separator className="mt-10" />
        </div>
      )}
    </div>
  );
}

function QuestionHistoryStep({
  answer,
  opacity,
  index,
}: {
  answer: Answer;
  opacity: number;
  index: number;
}) {
  const {
    data: username,
    error: usernameError,
    isPending: usernameIsLoading,
  } = useFetchUsername(answer.actor);
  const isCurrent = index === 0;

  return (
    <div className="relative flex w-full">
      <div className="w-[3rem] flex justify-center relative">
        <div className="relative w-10 h-10 flex items-center justify-center">
          {isCurrent && (
            <div className="absolute w-10 h-10 rounded-full bg-primary" />
          )}
          <Circle
            className={`w-10 h-10 ${isCurrent ? 'text-white' : 'text-gray-300'}`}
            strokeWidth={2}
          />
        </div>
        {/* Connector Line */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200 z-0" />
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 flex-1">
        {/* Title + Date */}
        <div>
          <div className="font-bold">Endret svar</div>
          <div className="text-sm text-gray-500">
            {formatDateTime(answer.updated)}
          </div>
        </div>

        {/* Answer */}
        <div
          className={cn('flex items-center gap-2', opacity < 1 && 'opacity-60')}
        >
          <Icon icon="trip_origin" color="#3b82f6" />
          <span className="text-blue-500">
            {answer.answer ? answer.answer : '-'}{' '}
            {answer.answer &&
              (answer.answerType === 'PERCENT' ? '%' : answer.answerUnit || '')}
          </span>
        </div>

        {/* User Info */}
        <div
          className={cn('flex items-center gap-2', opacity < 1 && 'opacity-60')}
        >
          <Icon icon="person" filled color="#3b82f6" />
          <span className="text-blue-500">
            {usernameIsLoading
              ? 'Laster...'
              : usernameError
                ? 'Feil ved henting av bruker'
                : username}
          </span>
        </div>
      </div>
    </div>
  );
}

import { Row } from '@tanstack/react-table';
import { AnswerCell } from './AnswerCell';
import { Column, OptionalFieldType, Question, User } from '../../../api/types';
import colorUtils from '../../../utils/colorUtils';
import Markdown from 'react-markdown';
import { markdownComponents } from '../../../utils/markdownComponents';
import { useIsMutating } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

type Props = {
  contextId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  column: Column;
  row: Row<Question>;
  answerable?: boolean;
  user: User;
};

export const TableCell = ({
  contextId,
  value,
  column,
  row,
  answerable = false,
  user,
}: Props) => {
  const navigate = useNavigate();
  const isMutating = useIsMutating();
  const isInputDisabled = isMutating !== 0;

  if (answerable) {
    return (
      <AnswerCell
        value={row.original.answers.at(-1)?.answer}
        answerType={row.original.metadata?.answerMetadata.type}
        unit={row.original.answers.at(-1)?.answerUnit}
        units={row.original.metadata?.answerMetadata.units}
        recordId={row.original.recordId}
        contextId={contextId}
        questionId={row.original.id}
        comment={row.original.comments?.at(0)?.comment ?? ''}
        updated={row.original.answers.at(-1)?.updated}
        choices={row.original.metadata?.answerMetadata.options}
        options={column.options}
        user={user}
        answerExpiry={row.original.metadata?.answerMetadata.expiry}
        disabled={isInputDisabled}
      />
    );
  }

  if (value == null) {
    return <></>;
  }

  switch (value.type) {
    case OptionalFieldType.OPTION_MULTIPLE: {
      const valueArray = value.value;
      return (
        <div className="flex flex-wrap gap-1">
          {valueArray
            .sort((a: string, b: string) => a.length - b.length)
            .map((text: string, index: number) => {
              return <Badge key={index}>{text}</Badge>;
            })}
        </div>
      );
    }
    case OptionalFieldType.OPTION_SINGLE: {
      const backgroundColor = column.options?.find(
        (option) => option.name === value.value[0]
      )?.color;

      const backgroundColorHex = colorUtils.getHexForColor(
        backgroundColor ?? 'grayLight1'
      );
      const useWhiteTextColor = colorUtils.shouldUseLightTextOnColor(
        backgroundColor ?? 'grayLight1'
      );

      return (
        <Badge
          style={{
            backgroundColor: backgroundColorHex ?? '#FFFFFF',
          }}
          className={`text-${useWhiteTextColor ? 'white' : 'black'}`}
        >
          {value.value}
        </Badge>
      );
    }
  }

  if (column.name === 'Kortnavn' || column.name === 'Navn') {
    return (
      <div className="max-w-[650px] whitespace-normal">
        <Button
          aria-label="Se detaljer"
          variant="link"
          onClick={() => navigate(`${row.original.recordId}`)}
          className="p-0 text-sm h-0 whitespace-normal text-left"
        >
          {value.value[0]}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[650px] whitespace-normal text-sm">
      <Markdown components={markdownComponents}>
        {value.value[0].split('\n\n')[0]}
      </Markdown>
    </div>
  );
};

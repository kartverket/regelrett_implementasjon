import {
  SelectLabel,
  SelectRoot,
  SelectValueText,
  SelectTrigger,
  SelectIndicatorGroup,
  SelectIndicator,
  Spinner,
  createListCollection,
  SelectContent,
  SelectItem,
  Flex,
  Text,
  RadioGroupRoot,
  VStack,
  RadioGroupItem,
  RadioGroupItemHiddenInput,
  RadioGroupItemIndicator,
  RadioGroupItemText,
} from '@kvib/react';
import { useSearchParams } from 'react-router';
import { useFetchAllContexts } from '../../hooks/useContext';
import { useMemo } from 'react';

export function CopyContextDropdown({
  setCopyContext,
  copyComments,
  setCopyComments,
}: {
  setCopyContext: (context: string) => void;
  copyComments: 'yes' | 'no' | null;
  setCopyComments: (val: 'yes' | 'no') => void;
}) {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const copyContext = searchParams.get('copyContext');

  const { data: contexts, isPending: contextsIsLoading } =
    useFetchAllContexts();

  const contextsCollection = useMemo(() => {
    return createListCollection({
      items: contexts?.filter((context) => context.formId == formId) ?? [],
      itemToString: (context) => context.name,
      itemToValue: (context) => context.id,
    });
  }, [contexts, formId]);

  const isDisabled = contextsCollection.size === 0;

  return (
    <>
      <SelectRoot
        deselectable
        disabled={isDisabled}
        collection={contextsCollection}
        id="select"
        onValueChange={(e) => setCopyContext(e.value[0])}
        value={copyContext ? [copyContext] : []}
      >
        <SelectLabel fontWeight="bold">
          Kopier svar fra eksisterende skjema
        </SelectLabel>
        <SelectTrigger bgColor="white">
          <SelectValueText
            placeholder={
              isDisabled ? 'Ingen eksisterende skjema funnet' : 'Velg skjema'
            }
          />
          <SelectIndicatorGroup>
            {contextsIsLoading && <Spinner size="xs" borderWidth="1.5px" />}
            <SelectIndicator />
          </SelectIndicatorGroup>
        </SelectTrigger>
        <SelectContent>
          {contextsCollection.items.map((context) => (
            <SelectItem key={context.id} item={context}>
              {context.name}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      {copyContext !== 'undefined' && copyContext !== null && (
        <Flex flexDirection="column" gap="2">
          <Text> Vil du også kopiere kommentarene?</Text>
          <RadioGroupRoot
            orientation="vertical"
            name="select-copy-comments"
            colorPalette="blue"
            value={copyComments ?? undefined}
            onValueChange={(e) => setCopyComments(e.value as 'yes' | 'no')}
          >
            <VStack align="start">
              <RadioGroupItem key="yes" value={'yes'}>
                <RadioGroupItemHiddenInput />
                <RadioGroupItemIndicator />
                <RadioGroupItemText>Ja</RadioGroupItemText>
              </RadioGroupItem>
              <RadioGroupItem key="no" value="no">
                <RadioGroupItemHiddenInput />
                <RadioGroupItemIndicator />
                <RadioGroupItemText>Nei</RadioGroupItemText>
              </RadioGroupItem>
            </VStack>
          </RadioGroupRoot>
        </Flex>
      )}
    </>
  );
}

import { useEffect, useState } from 'react';
import { RecordType } from '../pages/Table';
import colorUtils from '../utils/colorUtils';

export type TableMetaData = {
  id: string;
  name: string;
  primaryFieldId: string;
  views: View[];
  fields: Field[];
};

type View = {
  id: string;
  name: string;
  type: string;
};

export type Field = {
  id: string;
  name: string;
  type: string;
  options: Option | null;
};

export type Option = {
  inverseLinkFieldId: string;
  isReversed: boolean;
  linkedTableId: string;
  prefersSingleRecordLink: boolean;
  choices: Choice[];
};

export type Choice = {
  id: string;
  name: string;
  color: string;
};
export const useMetodeverkFetcher = (team?: string) => {
  const [data, setData] = useState<RecordType[]>([]);
  const [metadata, setMetadata] = useState<TableMetaData[]>([]);
  const [tableMetaData, setTableMetaData] = useState<TableMetaData>();
  const [dataError, setDataError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [choices, setChoices] = useState<Choice[] | []>([]);
  const URL = team
    ? `http://localhost:8080/${team}/kontrollere`
    : `http://localhost:8080/metodeverk`; // TODO: Place dev url to .env file

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData['metodeverkData']['records']);
        setMetadata(jsonData['metaData']['tables']);
      } catch (error) {
        setDataError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    dataFetcher();
  }, []);

  useEffect(() => {
    if (metadata.length > 0) {
      const aktivitetsTable = metadata.filter(
        (table: TableMetaData) => table.id === 'tblLZbUqA0XnUgC2v'
      )[0];

      if (!aktivitetsTable) {
        throw new Error(`Failed to fetch aktivitetstable`);
      }

      setTableMetaData(aktivitetsTable);

      const optionField = aktivitetsTable.fields.filter(
        (field: Field) => field.name === 'Svar'
      )[0];
      const options = optionField.options;
      const answerOptions = options?.choices;
      setChoices(answerOptions ?? []);
    }
  }, [metadata]);

  return { data, dataError, choices, tableMetaData, loading };
};

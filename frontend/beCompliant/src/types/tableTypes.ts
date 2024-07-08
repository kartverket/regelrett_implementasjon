export type TableMetaData = {
  id: string;
  name: string;
  primaryFieldId: string;
  views: View[];
  fields: Field[];
};

export type View = {
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

export type Fields = {
  Kortnavn: string;
  Pri: string;
  Løpenummer: number;
  Ledetid: string;
  Aktivitet: string;
  Område: string;
  Hvem: string[];
  Kode: string;
  ID: string;
  question: string;
  updated: string;
  Svar: string;
  actor: string;
  Status: string;
  comment: string;
};

export type RecordType = Record<string, Fields>;

export type ActiveFilter = {
  filterName: string;
  filterValue: string;
};

export type MetodeverkData = {
  metodeverkData: {
    records: RecordType[];
  };
  metaData: {
    tables: TableMetaData[];
  };
};

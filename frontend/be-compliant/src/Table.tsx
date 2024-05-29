import { TableContainer, Table, Thead, Tr, Th, Tbody } from "@kvib/react";
import { useState, useEffect } from "react";
import { useAnswersFetcher } from "./hooks/answersFetcher";
import { QuestionRow } from "./questionRow/QuestionRow";
import { AnswerType } from "./answer/Answer";

type MetaData = {
    id: string;
    name: string;
    primaryFieldId: string;
    views: View[];
    fields: Field[];
  }
  
  type View = {
    id: string;
    name: string;
    type: string;
  }
  
  type Field = {
    id: string;
    name: string;
    type: string;
    options: Option | null;
  }
  
  type Option = {
    inverseLinkFieldId: string;
    isReversed: boolean;
    linkedTableId: string;
    prefersSingleRecordLink: boolean;
    choices: Choice[]
  }
  
  type Choice = {
    id: string;
    name: string;
    color: string;
  }

  export type Fields = {
    Kortnavn: string;
    Pri: string;
    Løpenummer: number;
    Ledetid: string;
    Aktivitiet: string;
    Område: string;
    Hvem: string[];
    Kode: string;
    ID: string;
  };
  

export const MainTableComponent = () => {

    const [fetchNewAnswers, setFetchNewAnswers] = useState(true);
    const { answers } = useAnswersFetcher(fetchNewAnswers, setFetchNewAnswers);
    const [data, setData] = useState<Record<string, Fields>[]>([]);
    const [metadata, setMetadata] = useState<MetaData[]>([]);
    const [dataError, setDataError] = useState<string | null>(null);
    const [choices, setChoices] = useState<string[] | []>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/metodeverk"); // TODO: Place dev url to .env file
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }

                const jsonData = await response.json();
                setData(jsonData["metodeverkData"]["records"]);
                setMetadata(jsonData["metaData"]["tables"]);
            } catch (error) {
                setDataError("Error fetching data");
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


  useEffect(() => {
    if (metadata.length > 0) {
      const aktivitetsTable = metadata.filter(
        (table: MetaData) => table.id === "tblLZbUqA0XnUgC2v",
      )[0];

      if (!aktivitetsTable) {
        throw new Error(`Failed to fetch aktivitetstable`);
      }

      const optionField = aktivitetsTable.fields.filter(
        (field: Field) => field.id === "fldbHk1Ce1Ccw5QvF",
      )[0];
      const options = optionField.options;
      const answerOptions = options?.choices.map((choice: Choice) => choice.name);
      setChoices(answerOptions ?? []);
    }

  }, [metadata]);
    return (
        <div>
          {dataError ? (
              <div>{dataError}</div> // Display error if there is any
          ) : data.length > 0 ? (
              <TableContainer>
                  <Table
                      variant="striped"
                      colorScheme="green"
                      style={{tableLayout: "auto" }}
                  >
                      <Thead>
                          <Tr>
                              <Th>ID</Th>
                              <Th>Spørsmål</Th>
                              <Th>Status</Th>
                              <Th>Svaralternativer</Th>
                          </Tr>
                      </Thead>
                      <Tbody>
                          {data.map((item, index) => (
                              <QuestionRow
                                  key={index}
                                  record={item}
                                  choices={choices}
                                  answer={answers?.find(
                                      (answer: AnswerType) => answer.questionId === item.fields.ID,
                                  )}
                                  setFetchNewAnswers={setFetchNewAnswers}
                                  fetchNewAnswers={fetchNewAnswers}
                              />
                          ))}
                      </Tbody>
                  </Table>
              </TableContainer>
          ) : (
              "No data to display..."
          )}
      </div>
    )
}
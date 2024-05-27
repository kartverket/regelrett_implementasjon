import React, { useState, useEffect } from "react";
import "./App.css";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody } from "@kvib/react";
import { Answer } from "./answer/Answer";
import { useAnswersFetcher } from "./hooks/answersFetcher";

function App() {
  const { answers } = useAnswersFetcher();
  const [data, setData] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [choices, setChoices] = useState<any[]>([]);

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
        (table: any) => table.id === "tblLZbUqA0XnUgC2v"
      )[0];

      if (aktivitetsTable.length < 0) {
        throw new Error(`Failed to fetch aktivitetstable`);
      }

      const optionField = aktivitetsTable.fields.filter(
        (field: any) => field.id === "fldbHk1Ce1Ccw5QvF"
      )[0];
      const options = optionField.options;
      const answerOptions = options.choices.map((option: any) => option.name);
      setChoices(answerOptions);
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
            style={{ tableLayout: "auto" }}
          >
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Spørsmål</Th>
                <Th>Svaralternativer</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => (
                <RecordItem
                  key={index}
                  record={item}
                  choices={choices}
                  answer={answers?.find(
                    (answer: any) => answer.questionId === item.fields.ID
                  )}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        "No data to display..."
      )}
    </div>
  );
}

interface RecordItemProps {
  record: Record<any, any>;
  choices: any[];
  answer: any;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, choices, answer }) => {
  return (
    <Tr>
      <Td>{record.fields.ID} </Td>
      <Td>{record.fields.Aktivitiet}</Td>
      <Td>
        <Answer choices={choices} answer={answer} record={record} />
      </Td>
    </Tr>
  );
};

export default App;

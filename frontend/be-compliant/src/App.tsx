import React, {useState, useEffect} from 'react';
import './App.css';
import {TableContainer, Table, Thead, Tr, Th, Tbody, Select} from '@kvib/react';

function App() {
    const [data, setData] = useState<any[]>([]);
    const [metadata, setMetadata] = useState<any[]>([]);
    const [dataError, setDataError] = useState<string | null>(null);
    const [choices, setChoices] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/metodeverk'); // TODO: Place dev url to .env file
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }

                const jsonData = await response.json();
                setData(jsonData["metodeverkData"]["records"]);
                setMetadata(jsonData["metaData"]["tables"]);
            } catch (error) {
                setDataError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (metadata.length > 0) {
            const aktivitetsTable = metadata.filter((table: any) => table.id === "tblLZbUqA0XnUgC2v")[0];

            if (aktivitetsTable.length < 0) {
                throw new Error(`Failed to fetch aktivitetstable`);
            }

            const optionField = aktivitetsTable.fields.filter((field: any) => field.id === "fldbHk1Ce1Ccw5QvF")[0];
            const options = optionField.options;
            setChoices(options.choices)
        }
    }, [metadata]);

    return (
        <div>
            {dataError ? (
                <div>{dataError}</div> // Display error if there is any
            ) : (
                data.length > 0 ? (
                    <TableContainer>
                        <Table variant="striped" colorScheme="green" style={{ tableLayout: "auto"}}>
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Spørsmål</Th>
                                    <Th>Svaralternativer</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((item, index) => (
                                    <RecordItem key={index} record={item} choices={choices}/>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    "No data to display..."
                )
            )}
        </div>
    );
}

interface RecordItemProps {
    record: Record<any, any>;
    choices: any[];
}

const submitAnswer = async (answer: string) => {
    const url = 'http://localhost:8080/answer'; // TODO: Place dev url to .env file
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            actor: "Unknown",
            questionId: "HK01",
            question: "Hardkodet spørsmål",
            answer: answer,
        })
    }
    try {
        const response = await fetch(url, settings);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('There was an error with the submitAnswer request:', error);
    }
    return
}

const RecordItem: React.FC<RecordItemProps> = ({record, choices}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        submitAnswer(e.target.value)
    }

    return (
        <Tr>
            <td>{record.fields.ID} </td>
            <td>
                {record.fields.Aktivitiet}
            </td>
            <td>
                <Select
                    aria-label="select"
                    placeholder="Velg alternativ"
                    onChange={handleChange}
                >
                    {choices.map((choice, index) => (
                        <option value={choice.name} key={index}>
                            {choice.name}
                        </option>
                    ))}
                </Select>
            </td>
        </Tr>
    );
}

export default App;

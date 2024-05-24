import React, {useState, useEffect} from 'react';
import './App.css';
import {TableContainer, Table, Thead, Tr, Th, Tbody, Select} from '@kvib/react';

function App() {
    const [data, setData] = useState<any[]>([]);
    const [metadata, setMetadata] = useState<any[]>([]);
    const [dataError, setDataError] = useState<string | null>(null);
    const [metadataError, setMetadataError] = useState<string | null>(null);
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
            } catch (error) {
                setDataError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };

        const fetchMetaData = async () => {
            try {
                const response = await fetch('./metadata.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch metadata: ${response.status}`);
                }

                const jsonData = await response.json();
                setMetadata(jsonData['tables']);
            } catch (error) {
                setMetadataError('Error fetching metadata');
                console.error('Error fetching metadata:', error);
            }
        }

        fetchData();
        fetchMetaData();
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

const RecordItem: React.FC<RecordItemProps> = ({record, choices}) => {
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

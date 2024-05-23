import React, {useState, useEffect} from 'react';
import './App.css';
import {TableContainer, Table, Thead, Tr, Th, Tbody} from '@kvib/react'

function App() {
    // State to hold fetched JSON data
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/metodeverk'); // TODO: Place dev url to .env file
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }

                const jsonData = await response.json();
                setData(jsonData["records"]);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="App">
            {error ? (
                <div>{error}</div> // Display error if there is any
            ) : (
                data.length > 0 ? (
                    <TableContainer>
                        <Table variant="striped" colorScheme="green">
                            <Thead>
                                <Tr>
                                    <Th>ID:</Th>
                                    <Th>Spørsmål:</Th>
                                    <Th>PRI:</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((item, index) => (
                                    <RecordItem key={index} record={item}/>

                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    "No data to display..." // Display message when there is no data
                )
            )}
        </div>
    );
}

interface RecordItemProps {
    record: Record<any, any>;
}

const RecordItem: React.FC<RecordItemProps> = ({record}) => {
    return (
        <Tr>
            <td>{record.id} </td>
            <td>{record.fields.ID}</td>
            <td>{record.fields.Pri} </td>
        </Tr>
    );
}

export default App;

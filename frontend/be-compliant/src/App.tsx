import React, { useState, useEffect } from 'react';
import './App.css';

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
            <header className="App-header">
                {error ? (
                    <div>{error}</div> // Display error if there is any
                ) : (
                    data.length > 0 ? (
                        <div>
                            <h2>Spørsmål</h2>
                            {data.map((item, index) => (
                                <RecordItem key={index} record={item}/>
                            ))}
                        </div>
                    ) : (
                        "No data to display..." // Display message when there is no data
                    )
                )}
            </header>
        </div>
    );
}

interface RecordItemProps {
    record: Record<any, any>;
}

const RecordItem: React.FC<RecordItemProps> = ({ record }) => {
    return (
        <div className="record-item">
            <span><strong>ID: </strong> {record.id} </span>
            <span><strong>Spørsmål: </strong> {record.fields.ID} </span>
            <span><strong>PRI: </strong> {record.fields.Pri} </span>
        </div>
    );
}

export default App;

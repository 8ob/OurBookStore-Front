// ClassTable.tsx
import React, { useState, useEffect } from 'react';
import GetDb from './DbHelper';
import { QueryExecResult } from 'sql.js';

interface ClassTableProps {
    sql: string;
    colMap: Record<string, string>;
}

const ClassTable: React.FC<ClassTableProps> = ({ sql, colMap }) => {
    const [data, setData] = useState<QueryExecResult[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await GetDb(sql);
            setData(result);
        };

        fetchData();
    }, [sql]);

    return (
        <div className="coupon-table">
            <table>
                <thead>
                <tr>
                    {data[0]?.columns.map((col: string, i: number) => (
                        <th key={col + i}>{colMap[col] || col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data[0]?.values.map((row: any[], i: number) => (
                    <tr key={i}>
                        {row.map((cell: any, j: number) => (
                            <td key={j}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClassTable;
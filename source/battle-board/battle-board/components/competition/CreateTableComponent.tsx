import React, { useState, ChangeEvent, FC } from 'react';
import ReactDOM from 'react-dom';
import { Leaderboard } from '@/models/leaderboard';

interface TableModalProps {
  isOpen: boolean;
  leaderboard: Leaderboard | null;
  onClose: () => void;
  onSave: (columns: string[], rows: string[][]) => void;
}

const TableModal: FC<TableModalProps> = ({ isOpen, onClose }) => {
  
  //We love a little state
  const [columns, setColumns] = useState<string[]>(['name']);
  const [rows, setRows] = useState<string[][]>([['']]);

  if (!isOpen) return null; // If closed -> render nothing


  const handleAddColumn = () => {
    const newColumnName = prompt('Enter the new column name', `Column ${columns.length + 1}`);
    setColumns((prev) => [...prev, newColumnName || `Column ${columns.length + 1}`]);

    // For each row, add an empty cell
    setRows((prevRows) =>
      prevRows.map((row) => [...row, ''])
    );
  };

  const handleAddRow = () => {
    const newRow = Array(columns.length).fill('');
    setRows((prev) => [...prev, newRow]);
  };

  const handleCellChange = (rowIdx: number, colIdx: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRows((prev) => {
      const newRows = [...prev];
      const updatedRow = [...newRows[rowIdx]];
      updatedRow[colIdx] = value;
      newRows[rowIdx] = updatedRow;
      return newRows;
    });
  };

  // Kanske har vi CSS styles redan men jag icke förstå css
  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyles: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '6px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    color: 'black'
  };

  return ReactDOM.createPortal(
    <div style={modalStyles}>
      <div style={contentStyles}>
        <h2>Create leaderboard</h2>
        <p>The column &quot;name&quot; must be present and contain the users in the competition!</p>

        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1rem', color: 'black' }}>
          <thead>
            <tr>
              {columns.map((col, colIdx) => (
                <th
                  key={colIdx}
                  style={{ border: '1px solid #ccc', padding: '0.5rem', backgroundColor: '#f7f7f7' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowData, rowIdx) => (
              <tr key={rowIdx}>
                {rowData.map((cellValue, colIdx) => (
                  <td key={`${rowIdx}-${colIdx}`} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <input
                      type="text"
                      value={cellValue}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e)}
                      style={{ width: '100%' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleAddColumn}>Add Column</button>
          <button onClick={handleAddRow}>Add Row</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TableModal;
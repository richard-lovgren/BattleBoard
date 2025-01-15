import React, { useState, useEffect, ChangeEvent, FC } from 'react';
import ReactDOM from 'react-dom';
import { Leaderboard } from '@/models/leaderboard';

interface TableModalProps {
  isOpen: boolean;
  leaderboard: Leaderboard | null;
  userNames: string[] | null;
  onClose: () => void;
  onSave: (columns: string[], rows: string[][]) => void;
}

const TableModal: FC<TableModalProps> = ({ isOpen, leaderboard, userNames, onClose, onSave }) => {
  const [columns, setColumns] = useState<string[]>(['name']);
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    if (leaderboard) {
      setColumns(leaderboard.column_names);
      setRows(
        leaderboard.leaderboard_entries.map((entry) =>
          leaderboard.column_names.map((col) => entry[col] || '')
        )
      );
    } else if (userNames) {
      //init rows with user names
      setRows(userNames.map((userName) => [userName]));
    }
  }, [leaderboard, userNames]);

  if (!isOpen) return null;

  const handleAddColumn = () => {
    const newColumnName = prompt('Enter the new column name', `Column ${columns.length + 1}`);
    const updatedColumnName = newColumnName || `Column ${columns.length + 1}`;
    setColumns((prev) => [...prev, updatedColumnName]);
    setRows((prevRows) => prevRows.map((row) => [...row, '']));
  };

  /* Limit the ability to add new rows
  const handleAddRow = () => {
    const newRow = Array(columns.length).fill('');
    newRow[0] = ''; // Prevent new rows from modifying the "name" column
    setRows((prev) => [...prev, newRow]);
  };
  */

  const handleCellChange = (rowIdx: number, colIdx: number, event: ChangeEvent<HTMLInputElement>) => {
    if (colIdx === 0) return; // Prevent editing the "name" column
    const value = event.target.value;
    setRows((prev) => {
      const newRows = [...prev];
      const updatedRow = [...newRows[rowIdx]];
      updatedRow[colIdx] = value;
      newRows[rowIdx] = updatedRow;
      return newRows;
    });
  };

  const handleSave = () => {
    onSave(columns, rows);
    onClose();
  };

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
    color: 'black',
  };

  return ReactDOM.createPortal(
    <div style={modalStyles}>
      <div style={contentStyles}>
        <h2>{leaderboard ? 'Edit Leaderboard' : 'Create Leaderboard'}</h2>

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
                    {colIdx === 0 ? (
                      <span>{cellValue}</span> // Render name column as non-editable text
                    ) : (
                      <input
                        type="text"
                        value={cellValue}
                        onChange={(e) => handleCellChange(rowIdx, colIdx, e)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!leaderboard && (
            <>
              <button onClick={handleAddColumn}>Add Column</button>
              {/* <button onClick={handleAddRow}>Add Row</button> */}
            </>
            )}
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TableModal;
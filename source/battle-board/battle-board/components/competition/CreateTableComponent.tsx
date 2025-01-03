import React, { useState, useEffect, ChangeEvent, FC } from 'react';
import ReactDOM from 'react-dom';
import { Leaderboard } from '@/models/leaderboard';

interface TableModalProps {
  isOpen: boolean;
  leaderboard: Leaderboard | null;
  onClose: () => void;
  onSave: (columns: string[], rows: string[][]) => void;
}

const TableModal: FC<TableModalProps> = ({ isOpen, leaderboard, onClose, onSave }) => {
  const [columns, setColumns] = useState<string[]>(['name']);
  const [rows, setRows] = useState<string[][]>([['']]);
  const isEditing = !!leaderboard;

  useEffect(() => {
    if (leaderboard) {
      setColumns(leaderboard.column_names);
      setRows(
        leaderboard.leaderboard_entries.map((entry) =>
          leaderboard.column_names.map((col) => entry[col] || '')
        )
      );
    }
  }, [leaderboard]);

  if (!isOpen) return null;

  const handleAddColumn = () => {
    const newColumnName = prompt('Enter the new column name', `Column ${columns.length + 1}`);
    setColumns((prev) => [...prev, newColumnName || `Column ${columns.length + 1}`]);
    setRows((prevRows) => prevRows.map((row) => [...row, '']));
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
        <h2>{isEditing ? 'Edit Leaderboard' : 'Create Leaderboard'}</h2>
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
          {!isEditing && (
            <>
              <button onClick={handleAddColumn}>Add Column</button>
              <button onClick={handleAddRow}>Add Row</button>
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
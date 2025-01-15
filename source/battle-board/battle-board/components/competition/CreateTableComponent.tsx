import React, { useState, useEffect, ChangeEvent, FC } from 'react'
import ReactDOM from 'react-dom'
import { Leaderboard } from '@/models/leaderboard'
import GeneralButton from '../general-btn'

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
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const contentStyles: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '3rem 2rem',
    borderRadius: '6px',
    minWidth: '600px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    color: 'black',
  }

  return ReactDOM.createPortal(
    <div style={modalStyles}>
      <div style={contentStyles}>
        <h2 className='mb-4 font-odibee text-2xl'>
          {leaderboard ? 'Edit Leaderboard' : 'Create Leaderboard'}
        </h2>

        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '1rem',
            color: 'black',
          }}
        >
          <thead>
            <tr>
              {columns.map((col, colIdx) => (
                <th
                  key={colIdx}
                  className='font-nunito'
                  style={{
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    backgroundColor: '#f7f7f7',
                    textAlign: 'left',
                    fontSize: '1rem',
                  }}
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
                  <td
                    className='font-nunito'
                    key={`${rowIdx}-${colIdx}`}
                    style={{ border: '1px solid #ccc', padding: '0.5rem' }}
                  >
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

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {!leaderboard && (
            <GeneralButton onClick={handleAddColumn} text='Add Column' />
          )}
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'row' }}>
            <GeneralButton onClick={handleSave} text='Save' />
            <GeneralButton onClick={onClose} text='Close' />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TableModal

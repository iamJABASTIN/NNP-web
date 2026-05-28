import React from 'react';

const TableGrid = ({ tables, manualTableName, setManualTableName }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => setManualTableName(table.table_number)}
          className={`aspect-square flex flex-col items-center justify-center border-2 border-black font-black transition-all ${
            manualTableName === table.table_number 
              ? 'bg-accent text-black scale-105 shadow-[4px_4px_0px_#000000]' 
              : 'bg-white text-black/40 hover:bg-black/5'
          }`}
        >
          <span className="text-[8px] uppercase opacity-50">T</span>
          <span className="text-lg">{table.table_number}</span>
        </button>
      ))}
    </div>
  );
};

export default TableGrid;

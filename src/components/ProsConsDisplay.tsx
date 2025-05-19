import React from 'react';
import type { Database } from '@/types/database'; // Adjust path if necessary

interface ProsConsDisplayProps {
  database: Database;
}

export const ProsConsDisplay: React.FC<ProsConsDisplayProps> = ({ database }) => {
  if (!database.pros && !database.cons) {
    return null; // Or some placeholder if preferred
  }

  return (
    <div className="my-4">
      {database.pros && database.pros.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-500">Pros</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {database.pros.map((pro, index) => (
              <li key={`pro-${index}`}>{pro}</li>
            ))}
          </ul>
        </div>
      )}

      {database.cons && database.cons.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-2 text-red-700 dark:text-red-500">Cons</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {database.cons.map((con, index) => (
              <li key={`con-${index}`}>{con}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 
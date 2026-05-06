import React from 'react';

export function LevelBadge({ level }: { level: string }) {
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  
  const l = level.toUpperCase();
  if (l === 'L3' || l === 'SDE1') colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  else if (l === 'L4' || l === 'SDE2') colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
  else if (l === 'L5' || l === 'SDE3') colorClass = 'bg-green-100 text-green-800 border-green-200';
  else if (l === 'L6' || l === 'SENIOR') colorClass = 'bg-amber-100 text-amber-800 border-amber-200';
  else if (l === 'L7' || l === 'STAFF') colorClass = 'bg-orange-100 text-orange-800 border-orange-200';
  else if (l === 'PRINCIPAL') colorClass = 'bg-rose-100 text-rose-800 border-rose-200';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClass}`}>
      {level}
    </span>
  );
}

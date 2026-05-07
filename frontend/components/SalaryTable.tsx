import React from 'react';
import Link from 'next/link';
import { Salary } from '@/lib/api';
import { LevelBadge } from './LevelBadge';

interface SalaryTableProps {
  salaries: Salary[];
  loading: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

function formatINR(value: number): string {
  return '₹' + (value / 100000).toFixed(2) + 'L';
}

export function SalaryTable({ salaries, loading, selectedIds, onToggleSelect }: SalaryTableProps) {
  if (loading) {
    return (
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Base</th>
              <th className="px-6 py-4">Total Comp</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {[...Array(8)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (salaries.length === 0) {
    return (
      <div className="w-full p-12 text-center border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-medium text-gray-900">No salary data found for the selected filters.</h3>
        <p className="mt-2 text-gray-500">Try broadening your search.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
          <tr>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Level</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Experience</th>
            <th className="px-6 py-4">Base</th>
            <th className="px-6 py-4 font-semibold text-gray-900">Total Comp</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {salaries.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-indigo-600 capitalize">
                <Link href={`/company/${s.company}`} className="hover:underline">
                  {s.company}
                </Link>
              </td>
              <td className="px-6 py-4 text-gray-700">{s.role}</td>
              <td className="px-6 py-4">
                <LevelBadge level={s.level} />
              </td>
              <td className="px-6 py-4 text-gray-600">{s.location}</td>
              <td className="px-6 py-4 text-gray-600">{s.experience_years} yrs</td>
              <td className="px-6 py-4 text-gray-600">{formatINR(s.base_salary)}</td>
              <td className="px-6 py-4 font-semibold text-gray-900">{formatINR(s.total_compensation)}</td>
              <td className="px-6 py-4">
                {selectedIds && onToggleSelect ? (
                  <button 
                    className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                      selectedIds.includes(s.id) 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => onToggleSelect(s.id)}
                  >
                    {selectedIds.includes(s.id) ? 'Selected' : 'Select'}
                  </button>
                ) : (
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => alert('Compare feature coming soon!')}>
                    Compare
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

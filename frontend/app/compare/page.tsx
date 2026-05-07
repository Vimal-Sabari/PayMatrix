"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchCompare, CompareResponse } from '@/lib/api';
import { LevelBadge } from '@/components/LevelBadge';

function formatINR(value: number): string {
  return '₹' + (value / 100000).toFixed(2) + 'L';
}

function formatDiff(value: number): string {
  if (value === 0) return '0';
  const isPositive = value > 0;
  const absVal = Math.abs(value);
  const formatted = formatINR(absVal);
  return isPositive ? `+ ${formatted}` : `- ${formatted}`;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

  const [data, setData] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id1 || !id2) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchCompare(id1, id2);
        setData(res);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id1, id2]);

  if (!id1 || !id2) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Invalid comparison link. Please select two salaries from the main table.</h2>
        <Link href="/" className="text-indigo-600 hover:underline">← Back to home</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Could not load comparison data.</h2>
        <Link href="/" className="text-indigo-600 hover:underline">← Back to home</Link>
      </main>
    );
  }

  const { salary1, salary2, difference } = data;

  const DiffCell = ({ value }: { value: number }) => {
    if (value === 0) return <td className="px-4 py-4 text-center text-gray-500 font-medium">0</td>;
    const isPositive = value > 0;
    return (
      <td className={`px-4 py-4 text-center font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {formatDiff(value)}
      </td>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium inline-block mb-2">
          ← Back to all salaries
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Salary Comparison
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 capitalize mb-1">{salary1.company}</h2>
              <p className="text-gray-700 font-medium mb-3">{salary1.role}</p>
              <div className="mb-2"><LevelBadge level={salary1.level} /></div>
              <p className="text-sm text-gray-500 mt-2">{salary1.location}</p>
            </div>
            <div className="p-6 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 capitalize mb-1">{salary2.company}</h2>
              <p className="text-gray-700 font-medium mb-3">{salary2.role}</p>
              <div className="mb-2"><LevelBadge level={salary2.level} /></div>
              <p className="text-sm text-gray-500 mt-2">{salary2.location}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4 w-1/4">Component</th>
                  <th className="px-4 py-4 w-1/4 text-center">Salary 1</th>
                  <th className="px-4 py-4 w-1/4 text-center">Salary 2</th>
                  <th className="px-4 py-4 w-1/4 text-center">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">Base Salary</td>
                  <td className="px-4 py-4 text-center text-gray-900">{formatINR(salary1.base_salary)}</td>
                  <td className="px-4 py-4 text-center text-gray-900">{formatINR(salary2.base_salary)}</td>
                  <DiffCell value={difference.base_salary} />
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">Bonus</td>
                  <td className="px-4 py-4 text-center text-gray-900">{formatINR(salary1.bonus)}</td>
                  <td className="px-4 py-4 text-center text-gray-900">{formatINR(salary2.bonus)}</td>
                  <DiffCell value={difference.bonus} />
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">Stock</td>
                  <td className="px-4 py-4 text-center text-gray-900">{formatINR(salary1.stock)}</td>
                  <td className="px-4 py-4 text-center text-gray-900">{formatINR(salary2.stock)}</td>
                  <DiffCell value={difference.stock} />
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-900">Total Comp</td>
                  <td className="px-4 py-4 text-center font-bold text-gray-900">{formatINR(salary1.total_compensation)}</td>
                  <td className="px-4 py-4 text-center font-bold text-gray-900">{formatINR(salary2.total_compensation)}</td>
                  <DiffCell value={difference.total_compensation} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          {difference.level_same ? (
            <div className="inline-block px-4 py-3 bg-green-50 text-green-800 rounded-md border border-green-200 font-medium">
              Both roles are at the same level ({salary1.level})
            </div>
          ) : (
            <div className="inline-block px-4 py-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
              <span className="font-bold">{salary1.level} vs {salary2.level}</span>
              <p className="text-sm mt-1">These roles are at different levels — factor this into your comparison.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}

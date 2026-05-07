"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchCompany, CompanyResponse } from '@/lib/api';
import { SalaryTable } from '@/components/SalaryTable';
import { LevelBadge } from '@/components/LevelBadge';

function formatINR(value: number): string {
  return '₹' + (value / 100000).toFixed(2) + 'L';
}

export default function CompanyPage() {
  const params = useParams();
  const name = typeof params.name === 'string' ? params.name : Array.isArray(params.name) ? params.name[0] : '';
  const decodedName = decodeURIComponent(name);

  const [data, setData] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchCompany(decodedName);
        setData(res);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (decodedName) {
      loadData();
    }
  }, [decodedName]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-12 w-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company not found or no salary data available.</h2>
        <Link href="/" className="text-indigo-600 hover:underline">
          ← Back to home
        </Link>
      </main>
    );
  }

  const sortedLevels = Object.entries(data.level_distribution).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedLevels.length > 0 ? sortedLevels[0][1] : 1;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium inline-block mb-2">
          ← Back to all salaries
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 capitalize">
            {data.company}
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {data.total_records} salary records
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Median Total Comp</p>
            <p className="text-3xl font-bold text-gray-900">{formatINR(data.median_total_compensation)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Salary Records</p>
            <p className="text-3xl font-bold text-gray-900">{data.total_records}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Distinct Levels</p>
            <p className="text-3xl font-bold text-gray-900">{Object.keys(data.level_distribution).length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Level Distribution</h2>
          <div className="space-y-4">
            {sortedLevels.map(([lvl, count]) => {
              const widthPercent = (count / maxCount) * 100;
              return (
                <div key={lvl} className="flex items-center gap-4">
                  <div className="w-24 shrink-0">
                    <LevelBadge level={lvl} />
                  </div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 transition-all duration-500" 
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                  </div>
                  <div className="w-24 shrink-0 text-right text-sm font-medium text-gray-600">
                    {count} records
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Salaries</h2>
          <SalaryTable salaries={data.salaries} loading={false} />
        </div>
      </div>
    </main>
  );
}

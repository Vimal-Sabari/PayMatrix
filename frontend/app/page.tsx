"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/FilterBar';
import { SalaryTable } from '@/components/SalaryTable';
import { fetchSalaries, Salary, SalaryFilters } from '@/lib/api';

export default function Home() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SalaryFilters>({});
  const [error, setError] = useState<string | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchSalaries(filters);
        if (mounted) {
          setSalaries(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch salaries');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [filters]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        alert("Deselect one first");
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Compensation Intelligence
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Structured salary data for Indian tech roles
          </p>
        </div>

        <FilterBar onFilterChange={setFilters} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {loading ? 'Loading results...' : `Showing ${salaries.length} results`}
            </h2>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>

          <SalaryTable 
            salaries={salaries} 
            loading={loading} 
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">{selectedIds.length} selected</span>
              {selectedIds.length === 1 ? (
                <span className="text-gray-400 text-sm">Select one more to compare</span>
              ) : (
                <Link 
                  href={`/compare?id1=${selectedIds[0]}&id2=${selectedIds[1]}`}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Compare Now
                </Link>
              )}
            </div>
            <button 
              onClick={() => setSelectedIds([])}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

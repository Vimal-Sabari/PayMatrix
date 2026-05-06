import React, { useState, useEffect } from 'react';
import { SalaryFilters } from '@/lib/api';

interface FilterBarProps {
  onFilterChange: (filters: SalaryFilters) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('total_compensation');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({
        company: company || undefined,
        role: role || undefined,
        level: level || undefined,
        location: location || undefined,
        sortBy,
        order
      });
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [company, role, level, location, sortBy, order]);

  const handleClear = () => {
    setCompany('');
    setRole('');
    setLevel('');
    setLocation('');
    setSortBy('total_compensation');
    setOrder('desc');
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input 
          type="text" 
          placeholder="Filter by company" 
          value={company} 
          onChange={e => setCompany(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <input 
          type="text" 
          placeholder="Filter by role" 
          value={role} 
          onChange={e => setRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <select 
          value={level} 
          onChange={e => setLevel(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full bg-white"
        >
          <option value="">All Levels</option>
          <option value="L3">L3</option>
          <option value="L4">L4</option>
          <option value="L5">L5</option>
          <option value="L6">L6</option>
          <option value="L7">L7</option>
          <option value="SDE1">SDE1</option>
          <option value="SDE2">SDE2</option>
          <option value="SDE3">SDE3</option>
          <option value="SENIOR">SENIOR</option>
          <option value="STAFF">STAFF</option>
          <option value="PRINCIPAL">PRINCIPAL</option>
        </select>
        <input 
          type="text" 
          placeholder="Filter by location" 
          value={location} 
          onChange={e => setLocation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          >
            <option value="total_compensation">Total Compensation</option>
            <option value="base_salary">Base Salary</option>
            <option value="experience_years">Experience</option>
          </select>
          <button 
            onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-sm font-medium"
          >
            {order === 'desc' ? 'Desc ↓' : 'Asc ↑'}
          </button>
        </div>
        <button 
          onClick={handleClear}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

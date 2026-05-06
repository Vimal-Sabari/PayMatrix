export type Salary = {
  id: string
  company: string
  role: string
  level: string
  location: string
  experience_years: number
  base_salary: number
  bonus: number
  stock: number
  total_compensation: number
  confidence_score: number
  created_at: string
}

export type SalaryFilters = {
  company?: string
  role?: string
  level?: string
  location?: string
  sortBy?: string
  order?: "asc" | "desc"
}

export type SalaryResponse = {
  count: number
  data: Salary[]
}

export type CompanyResponse = {
  company: string
  total_records: number
  median_total_compensation: number
  level_distribution: Record<string, number>
  salaries: Salary[]
}

export type CompareResponse = {
  salary1: Salary
  salary2: Salary
  difference: {
    base_salary: number
    bonus: number
    stock: number
    total_compensation: number
    level_same: boolean
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchSalaries(filters: SalaryFilters): Promise<SalaryResponse> {
  const params = new URLSearchParams()
  if (filters.company) params.append('company', filters.company)
  if (filters.role) params.append('role', filters.role)
  if (filters.level) params.append('level', filters.level)
  if (filters.location) params.append('location', filters.location)
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.order) params.append('order', filters.order)

  const res = await fetch(`${API_URL}/salaries?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch salaries')
  return res.json()
}

export async function fetchCompany(name: string): Promise<CompanyResponse> {
  const res = await fetch(`${API_URL}/company/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error('Failed to fetch company')
  return res.json()
}

export async function fetchCompare(id1: string, id2: string): Promise<CompareResponse> {
  const res = await fetch(`${API_URL}/compare?salaryId1=${encodeURIComponent(id1)}&salaryId2=${encodeURIComponent(id2)}`)
  if (!res.ok) throw new Error('Failed to fetch comparison')
  return res.json()
}

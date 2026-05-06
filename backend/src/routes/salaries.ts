import { Router } from 'express';
import { PrismaClient, Level } from '@prisma/client';
import { normalizeCompany } from '../utils/normalize';

const router = Router();
const prisma = new PrismaClient();

router.get('/salaries', async (req, res) => {
  try {
    const { company, role, level, location, sortBy, order } = req.query;

    const where: any = {};

    if (company && typeof company === 'string') {
      where.company = normalizeCompany(company);
    }

    if (role && typeof role === 'string') {
      where.role = { contains: role, mode: 'insensitive' };
    }

    if (level && typeof level === 'string') {
      if (!Object.values(Level).includes(level as Level)) {
        return res.status(400).json({ error: 'Invalid level' });
      }
      where.level = level;
    }

    if (location && typeof location === 'string') {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const validSortFields = ['total_compensation', 'base_salary', 'experience_years', 'created_at'];
    let sortField = 'total_compensation';
    if (sortBy && typeof sortBy === 'string' && validSortFields.includes(sortBy)) {
      sortField = sortBy;
    }

    let sortOrder = 'desc';
    if (order === 'asc' || order === 'desc') {
      sortOrder = order;
    }

    const salaries = await prisma.salary.findMany({
      where,
      orderBy: { [sortField]: sortOrder }
    });

    res.status(200).json({
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { normalizeCompany } from '../utils/normalize';
import { computeMedian } from '../utils/stats';

const router = Router();
const prisma = new PrismaClient();

router.get('/company/:company', async (req, res) => {
  try {
    const normalizedCompany = normalizeCompany(req.params.company);

    const salaries = await prisma.salary.findMany({
      where: { company: normalizedCompany }
    });

    if (salaries.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const total_records = salaries.length;
    const allTotalCompensations = salaries.map(s => s.total_compensation);
    const median_total_compensation = computeMedian(allTotalCompensations);

    const level_distribution: Record<string, number> = {};
    salaries.forEach(s => {
      if (!level_distribution[s.level]) {
        level_distribution[s.level] = 0;
      }
      level_distribution[s.level]++;
    });

    res.status(200).json({
      company: normalizedCompany,
      total_records,
      median_total_compensation,
      level_distribution,
      salaries
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

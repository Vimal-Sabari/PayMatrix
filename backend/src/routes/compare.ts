import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/compare', async (req, res) => {
  try {
    const { salaryId1, salaryId2 } = req.query;

    if (!salaryId1 || !salaryId2 || typeof salaryId1 !== 'string' || typeof salaryId2 !== 'string') {
      return res.status(400).json({ error: 'Both salaryId1 and salaryId2 are required' });
    }

    if (salaryId1 === salaryId2) {
      return res.status(400).json({ error: 'Cannot compare a record with itself' });
    }

    const salary1 = await prisma.salary.findUnique({ where: { id: salaryId1 } });
    const salary2 = await prisma.salary.findUnique({ where: { id: salaryId2 } });

    if (!salary1 || !salary2) {
      return res.status(404).json({ error: 'One or both salary records not found' });
    }

    res.status(200).json({
      salary1: {
        id: salary1.id,
        company: salary1.company,
        role: salary1.role,
        level: salary1.level,
        location: salary1.location,
        base_salary: salary1.base_salary,
        bonus: salary1.bonus,
        stock: salary1.stock,
        total_compensation: salary1.total_compensation
      },
      salary2: {
        id: salary2.id,
        company: salary2.company,
        role: salary2.role,
        level: salary2.level,
        location: salary2.location,
        base_salary: salary2.base_salary,
        bonus: salary2.bonus,
        stock: salary2.stock,
        total_compensation: salary2.total_compensation
      },
      difference: {
        base_salary: salary1.base_salary - salary2.base_salary,
        bonus: salary1.bonus - salary2.bonus,
        stock: salary1.stock - salary2.stock,
        total_compensation: salary1.total_compensation - salary2.total_compensation,
        level_same: salary1.level === salary2.level
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

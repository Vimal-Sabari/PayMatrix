import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient, Level } from '@prisma/client';
import { normalizeCompany } from '../utils/normalize';

const router = Router();
const prisma = new PrismaClient();

const ingestSchema = z.object({
  company: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  level: z.nativeEnum(Level),
  location: z.string().min(1),
  experience_years: z.number().min(0).max(50),
  base_salary: z.number().positive(),
  bonus: z.number().min(0).optional().default(0),
  stock: z.number().min(0).optional().default(0),
  confidence: z.number().min(0).max(1).optional().default(0.5)
});

router.post('/ingest-salary', async (req, res) => {
  try {
    const validated = ingestSchema.parse(req.body);
    
    const normalizedCompany = normalizeCompany(validated.company);
    const totalCompensation = validated.base_salary + validated.bonus + validated.stock;

    const existing = await prisma.salary.findFirst({
      where: {
        company: normalizedCompany,
        role: validated.role,
        level: validated.level,
        base_salary: validated.base_salary
      }
    });

    if (existing) {
      return res.status(409).json({ error: 'Duplicate entry' });
    }

    const newSalary = await prisma.salary.create({
      data: {
        company: normalizedCompany,
        role: validated.role,
        level: validated.level,
        location: validated.location,
        experience_years: validated.experience_years,
        base_salary: validated.base_salary,
        bonus: validated.bonus,
        stock: validated.stock,
        total_compensation: totalCompensation,
        confidence_score: validated.confidence
      }
    });

    res.status(201).json(newSalary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

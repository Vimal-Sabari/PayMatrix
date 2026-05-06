import { PrismaClient, Level } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const salariesToCreate = [
    // L4
    { company: 'google', role: 'Software Engineer', level: Level.L4, location: 'Bangalore', experience_years: 3.5, base_salary: 3000000, bonus: 300000, stock: 1500000, confidence_score: 0.8 },
    { company: 'google', role: 'Software Engineer', level: Level.L4, location: 'Hyderabad', experience_years: 4.0, base_salary: 3500000, bonus: 350000, stock: 1800000, confidence_score: 0.9 },
    { company: 'amazon', role: 'SDE II', level: Level.L4, location: 'Bangalore', experience_years: 3.0, base_salary: 2800000, bonus: 0, stock: 1200000, confidence_score: 0.7 },
    { company: 'microsoft', role: 'Software Engineer 2', level: Level.L4, location: 'Hyderabad', experience_years: 5.0, base_salary: 3200000, bonus: 300000, stock: 800000, confidence_score: 0.85 },
    { company: 'flipkart', role: 'SDE II', level: Level.L4, location: 'Bangalore', experience_years: 4.5, base_salary: 3800000, bonus: 380000, stock: 600000, confidence_score: 0.95 },

    // L5
    { company: 'google', role: 'Senior Software Engineer', level: Level.L5, location: 'Bangalore', experience_years: 7.0, base_salary: 6000000, bonus: 900000, stock: 3500000, confidence_score: 0.85 },
    { company: 'amazon', role: 'SDE III', level: Level.L5, location: 'Bangalore', experience_years: 8.5, base_salary: 5500000, bonus: 0, stock: 4000000, confidence_score: 0.9 },
    { company: 'amazon', role: 'SDE III', level: Level.L5, location: 'Hyderabad', experience_years: 6.5, base_salary: 5000000, bonus: 0, stock: 3000000, confidence_score: 0.75 },
    { company: 'atlassian', role: 'Senior Developer', level: Level.L5, location: 'Bangalore', experience_years: 8.0, base_salary: 6500000, bonus: 650000, stock: 3000000, confidence_score: 0.95 },
    { company: 'razorpay', role: 'Senior SDE', level: Level.L5, location: 'Bangalore', experience_years: 6.0, base_salary: 4500000, bonus: 500000, stock: 2000000, confidence_score: 0.8 },

    // L6
    { company: 'google', role: 'Staff Software Engineer', level: Level.L6, location: 'Bangalore', experience_years: 12.0, base_salary: 9500000, bonus: 1400000, stock: 8000000, confidence_score: 0.9 },
    { company: 'amazon', role: 'Principal SDE', level: Level.L6, location: 'Bangalore', experience_years: 11.5, base_salary: 8500000, bonus: 0, stock: 9000000, confidence_score: 0.85 },
    { company: 'microsoft', role: 'Principal Software Engineer', level: Level.L6, location: 'Hyderabad', experience_years: 14.0, base_salary: 9000000, bonus: 1800000, stock: 5000000, confidence_score: 0.95 },
    { company: 'flipkart', role: 'Architect', level: Level.L6, location: 'Bangalore', experience_years: 13.0, base_salary: 10000000, bonus: 2000000, stock: 4000000, confidence_score: 0.8 },
    { company: 'atlassian', role: 'Principal Developer', level: Level.L6, location: 'Bangalore', experience_years: 10.5, base_salary: 8000000, bonus: 800000, stock: 7000000, confidence_score: 0.88 },

    // SDE2
    { company: 'razorpay', role: 'SDE II', level: Level.SDE2, location: 'Bangalore', experience_years: 3.5, base_salary: 2800000, bonus: 280000, stock: 1000000, confidence_score: 0.85 },
    { company: 'razorpay', role: 'SDE II', level: Level.SDE2, location: 'Mumbai', experience_years: 2.5, base_salary: 2400000, bonus: 240000, stock: 800000, confidence_score: 0.8 },
    { company: 'flipkart', role: 'SDE II', level: Level.SDE2, location: 'Bangalore', experience_years: 3.0, base_salary: 3200000, bonus: 320000, stock: 1200000, confidence_score: 0.9 },
    { company: 'amazon', role: 'SDE II', level: Level.SDE2, location: 'Mumbai', experience_years: 4.0, base_salary: 3000000, bonus: 0, stock: 1500000, confidence_score: 0.75 },
    { company: 'microsoft', role: 'Software Engineer 2', level: Level.SDE2, location: 'Bangalore', experience_years: 2.0, base_salary: 2200000, bonus: 200000, stock: 500000, confidence_score: 0.7 },

    // Extra 5 to reach 25
    { company: 'google', role: 'Software Engineer', level: Level.L4, location: 'Bangalore', experience_years: 4.0, base_salary: 3200000, bonus: 320000, stock: 1600000, confidence_score: 0.6 },
    { company: 'atlassian', role: 'Developer', level: Level.L4, location: 'Bangalore', experience_years: 3.0, base_salary: 3500000, bonus: 350000, stock: 1000000, confidence_score: 0.9 },
    { company: 'microsoft', role: 'Senior Software Engineer', level: Level.L5, location: 'Bangalore', experience_years: 7.5, base_salary: 5000000, bonus: 1000000, stock: 2000000, confidence_score: 0.88 },
    { company: 'flipkart', role: 'SDE III', level: Level.L5, location: 'Mumbai', experience_years: 8.0, base_salary: 6000000, bonus: 600000, stock: 2500000, confidence_score: 0.82 },
    { company: 'razorpay', role: 'Staff Engineer', level: Level.L6, location: 'Bangalore', experience_years: 11.0, base_salary: 8000000, bonus: 800000, stock: 4000000, confidence_score: 0.91 }
  ].map(salary => ({
    ...salary,
    total_compensation: salary.base_salary + salary.bonus + salary.stock
  }));

  console.log('Seeding Database with 25 records...');

  const created = await prisma.salary.createMany({
    data: salariesToCreate,
  });

  console.log(`Successfully created ${created.count} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

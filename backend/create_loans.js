const sql = require('./db.js');

async function createLoansTable() {
  console.log("Creating finance_loans_schedule table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS public.finance_loans_schedule (
        id SERIAL PRIMARY KEY,
        loan_name VARCHAR(255) NOT NULL,
        period_quarter VARCHAR(10) NOT NULL,
        principal_amount NUMERIC(15,2) DEFAULT 0,
        interest_amount NUMERIC(15,2) DEFAULT 0,
        covenant_limit_de NUMERIC(5,2),
        covenant_limit_icr NUMERIC(5,2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`TRUNCATE TABLE public.finance_loans_schedule;`;

    await sql`
      INSERT INTO public.finance_loans_schedule (loan_name, period_quarter, principal_amount, interest_amount, covenant_limit_de, covenant_limit_icr)
      VALUES 
        ('Préstamo Sindicado A', 'Q3 2024', 15.0, 3.5, 3.0, 2.0),
        ('Línea Capital Trabajo', 'Q3 2024', 5.0, 1.5, 3.0, 2.0),
        ('Préstamo Sindicado A', 'Q4 2024', 5.0, 1.0, 3.0, 2.0),
        ('Línea Capital Trabajo', 'Q4 2024', 0.0, 1.0, 3.0, 2.0),
        ('Préstamo Sindicado A', 'Q1 2025', 5.0, 1.0, 3.0, 2.0),
        ('Préstamo Sindicado A', 'Q2 2025', 8.0, 2.0, 3.0, 2.0),
        ('Bono Corporativo 2026', '2026+', 45.0, 15.0, 3.0, 2.0);
    `;

    console.log("finance_loans_schedule created and populated successfully!");
    process.exit(0);
  } catch(e) {
    console.error("Error creating table:", e);
    process.exit(1);
  }
}

createLoansTable();

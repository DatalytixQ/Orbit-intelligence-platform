const express = require("express");
const postgres = require("postgres");
require("dotenv").config();

const app = express();
app.use(express.json());

const sql = postgres(process.env.DATABASE_URL);

app.get("/health", async (_req, res) => {
    try {
        await sql`select 1`;
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.get("/netsuite/customers", (_req, res) => {
    res.json({
        ok: true,
        items: [
            {
                id: "1001",
                entityId: "CUST-001",
                companyName: "Empresa Demo 1",
                email: "contacto@empresademo1.com",
                phone: "111111111",
                isInactive: false
            },
            {
                id: "1002",
                entityId: "CUST-002",
                companyName: "Empresa Demo 2",
                email: "admin@empresademo2.com",
                phone: "222222222",
                isInactive: false
            }
        ]
    });
});

app.get("/kpi/customers", async (_req, res) => {
    try {
        const result = await sql`
      select
        count(*) as total_clientes,
        count(*) filter (where is_inactive = false) as clientes_activos,
        count(*) filter (where is_inactive = true) as clientes_inactivos
      from public.customers
    `;

        res.json(result[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/kpi/customers-over-time", async (_req, res) => {
    try {
        const result = await sql`
      select
        date(last_synced_at) as fecha,
        count(*) as clientes
      from public.customers
      group by date(last_synced_at)
      order by fecha desc
    `;

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/netsuite/sales", (_req, res) => {
    res.json({
        ok: true,
        items: [
            {
                id: "SO-001",
                customerId: "1001",
                customerName: "Empresa Demo 1",
                totalAmount: 150000,
                currency: "ARS",
                orderDate: "2026-03-25"
            },
            {
                id: "SO-002",
                customerId: "1002",
                customerName: "Empresa Demo 2",
                totalAmount: 220000,
                currency: "ARS",
                orderDate: "2026-03-26"
            }
        ]
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
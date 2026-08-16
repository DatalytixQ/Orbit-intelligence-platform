/**
 * DQBot Automated Test Suite
 * Tests all agent routes end-to-end with real DB queries.
 * Run: node backend/tests/dqbot.test.js
 */

const { generateHeuristicResponse } = require("../services/dqbotHeuristicEngine");

// ─── Test Case Definitions ─────────────────────────────────────────────────

const TEST_CASES = [
  // === INVENTARIO ===
  {
    id: "I001-quiebre-inminente",
    domain: "Inventario",
    rule: "I001",
    question: "Explorar: Riesgo inminente por Órdenes de Venta abiertas",
    expectKeywords: ["cobertura", "lead time", "crítico", "stock"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Quiebre de stock inminente (desde InventoryActionPanel)",
  },
  {
    id: "I001-direct",
    domain: "Inventario",
    rule: "I001",
    question: "quiebre de stock",
    expectKeywords: ["stock", "meses", "demanda"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Quiebre de stock por keyword directa",
  },
  {
    id: "I003-capital-inmovilizado",
    domain: "Inventario",
    rule: "I003",
    question: "Explorar: capital inmovilizado en inventario",
    expectKeywords: ["capital", "inmovilizado", "rotación"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Capital inmovilizado / Slow Moving",
  },
  {
    id: "I003-sin-rotacion",
    domain: "Inventario",
    rule: "I003",
    question: "inventario sin rotacion",
    expectKeywords: ["capital", "inmovilizado"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Slow Moving por keyword",
  },

  // === VENTAS ===
  {
    id: "V001-cumplimiento",
    domain: "Ventas",
    rule: "V001",
    question: "Explorar: Desviación en Proyección de Cierre",
    expectKeywords: ["cumplimiento", "forecast"],
    expectTable: true,
    expectNoUndefined: false,
    description: "Cumplimiento comercial por vendedor",
  },
  {
    id: "V002-desviacion",
    domain: "Ventas",
    rule: "V002",
    question: "desviacion de forecast comercial",
    expectKeywords: ["desvío", "forecast", "gap"],
    expectTable: true,
    expectNoUndefined: false,
    description: "Desviación de forecast vs real",
  },

  // === FINANZAS / CxC ===
  {
    id: "C001-regularizacion",
    domain: "Finanzas",
    rule: "C001",
    question: "Explorar: Regularización Inmediata",
    expectKeywords: ["vencido", "cliente", "deuda"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Exposición CxC con clientes críticos",
  },
  {
    id: "C001-mora",
    domain: "Finanzas",
    rule: "C001",
    question: "cobranza vencida clientes",
    expectKeywords: ["vencido", "cliente"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Mora / CxC por keyword",
  },

  // === ABASTECIMIENTO ===
  {
    id: "E002-riesgo-cliente",
    domain: "Abastecimiento",
    rule: "E002",
    question: "Explorar: Riesgo comercial por cliente — clientes con deuda vencida que puede impactar el supply chain",
    expectKeywords: ["deuda", "cliente", "supply"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Riesgo por cliente deudor en supply",
  },
  {
    id: "E002-direct",
    domain: "Abastecimiento",
    rule: "E002",
    question: "riesgo por cliente deudor",
    expectKeywords: ["deuda", "cliente"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Riesgo cliente por keyword",
  },
  {
    id: "S001-cronograma",
    domain: "Abastecimiento",
    rule: "S001",
    question: "Explorar: Cronograma de embarques críticos — OCs en tránsito con riesgo de demora en entrega",
    expectKeywords: ["embarque", "OC", "entrega"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Cronograma de embarques / OCs en tránsito",
  },
  {
    id: "S001-direct",
    domain: "Abastecimiento",
    rule: "S001",
    question: "cronograma de arribo",
    expectKeywords: ["embarque", "entrega"],
    expectTable: true,
    expectNoUndefined: true,
    description: "Embarques por keyword 'arribo'",
  },

  // === HOME / GENERAL ===
  {
    id: "HOME-empty",
    domain: "Home",
    rule: null,
    question: "",
    expectKeywords: ["alertas", "analista"],
    expectTable: false,
    expectNoUndefined: false,
    description: "Respuesta inicial del Home (sin pregunta)",
  },
];

// ─── Test Runner ────────────────────────────────────────────────────────────

const BOLD   = "\x1b[1m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";

function check(label, condition, detail = "") {
  if (condition) {
    return { pass: true, label, detail: "" };
  }
  return { pass: false, label, detail };
}

async function runTest(tc) {
  const startMs = Date.now();
  let result;

  try {
    result = await generateHeuristicResponse({ question: tc.question, clientId: "vonderk" });
  } catch (e) {
    return {
      id: tc.id,
      description: tc.description,
      pass: false,
      durationMs: Date.now() - startMs,
      errors: [`CRASH: ${e.message}`],
      warnings: [],
    };
  }

  const durationMs = Date.now() - startMs;
  const errors = [];
  const warnings = [];
  const answer = result.answer || "";
  const answerLower = answer.toLowerCase();

  // Check 1: No crash
  const c1 = check("No crash", true);

  // Check 2: answer is not empty
  const c2 = check("Answer non-empty (>50 chars)", answer.length >= 50, `Got: ${answer.length} chars`);
  if (!c2.pass) errors.push(c2);

  // Check 3: Keywords present in answer
  const missingKeywords = tc.expectKeywords.filter(kw => !answerLower.includes(kw.toLowerCase()));
  const c3 = check(
    `Keywords found: [${tc.expectKeywords.join(", ")}]`,
    missingKeywords.length === 0,
    `Missing: [${missingKeywords.join(", ")}]`
  );
  if (!c3.pass) warnings.push(c3);

  // Check 4: Table expected → markdown table present
  if (tc.expectTable) {
    const hasTable = answer.includes("|") && answer.includes("---");
    const c4 = check("Markdown table present", hasTable, "No table found in response");
    if (!c4.pass) errors.push(c4);
  }

  // Check 5: No undefined in answer
  if (tc.expectNoUndefined) {
    const hasUndefined = answerLower.includes("undefined") || answerLower.includes("null |") || answerLower.includes("| null");
    const c5 = check("No 'undefined' in answer", !hasUndefined, "Found 'undefined' or 'null' in table cells");
    if (!c5.pass) errors.push(c5);
  }

  // Check 6: No generic error fallback
  const isErrorFallback = answer.includes("no pude identificar") || answer.includes("no he podido mapear");
  const c6 = check("Not a fallback error response", !isErrorFallback, "Response is a generic fallback");
  if (!c6.pass) warnings.push(c6);

  // Check 7: Data coherence — if rule is I001 (quiebre), check that data has items where stock < demand×3
  if (tc.rule === "I001" && result.data && result.data.length > 0) {
    const firstItem = result.data[0];
    const stock = Number(firstItem.stock_available || 0);
    const demand = Number(firstItem.avg_monthly_qty_3m || 0);
    const coverage = Number(firstItem.stock_coverage_months || 0);
    const coherent = demand > 0 && coverage < 3; // Should have less than 3 months coverage
    const c7 = check(
      `I001 coherence: first item coverage < 3 months`,
      coherent,
      `stock=${stock}, demand/mo=${demand.toFixed(1)}, coverage=${coverage.toFixed(1)} months`
    );
    if (!c7.pass) errors.push(c7);
  }

  // Check 8: Suggested questions not empty
  const hasSuggestions = result.suggestedQuestions && result.suggestedQuestions.length > 0;
  const c8 = check("Has suggested questions", hasSuggestions, "No suggested questions returned");
  if (!c8.pass) warnings.push(c8);

  const totalErrors = errors.length;
  return {
    id: tc.id,
    description: tc.description,
    pass: totalErrors === 0,
    durationMs,
    errors: errors.map(e => `${e.label}: ${e.detail}`),
    warnings: warnings.map(w => `${w.label}: ${w.detail}`),
    answer: answer.substring(0, 200),
  };
}

async function main() {
  console.log(`\n${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}  DQBot Automated Test Suite — ${new Date().toLocaleString("es-AR")}${RESET}`);
  console.log(`${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}\n`);

  let passed = 0;
  let failed = 0;
  let warned = 0;

  for (const tc of TEST_CASES) {
    process.stdout.write(`  Testing [${tc.id}] ${tc.description}... `);
    const res = await runTest(tc);

    if (res.pass && res.warnings.length === 0) {
      console.log(`${GREEN}✅ PASS${RESET} (${res.durationMs}ms)`);
      passed++;
    } else if (res.pass && res.warnings.length > 0) {
      console.log(`${YELLOW}⚠️  PASS WITH WARNINGS${RESET} (${res.durationMs}ms)`);
      res.warnings.forEach(w => console.log(`    ${YELLOW}⚠ ${w}${RESET}`));
      warned++;
      passed++;
    } else {
      console.log(`${RED}❌ FAIL${RESET} (${res.durationMs}ms)`);
      res.errors.forEach(e => console.log(`    ${RED}✗ ${e}${RESET}`));
      if (res.warnings.length > 0) {
        res.warnings.forEach(w => console.log(`    ${YELLOW}⚠ ${w}${RESET}`));
      }
      failed++;
    }
  }

  console.log(`\n${BOLD}══ Results ══════════════════════════════════════════════${RESET}`);
  console.log(`  Total:   ${TEST_CASES.length} tests`);
  console.log(`  ${GREEN}Passed:${RESET}  ${passed}`);
  console.log(`  ${YELLOW}Warned:${RESET}  ${warned}`);
  console.log(`  ${RED}Failed:${RESET}  ${failed}`);
  console.log(`${"═".repeat(56)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(`\n${RED}FATAL TEST ERROR:${RESET}`, e.message);
  process.exit(1);
});

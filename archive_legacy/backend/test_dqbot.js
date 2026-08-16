const { handleInventoryQuery } = require('./services/dqbot/agents/inventoryAgent');
async function run() {
  const result = await handleInventoryQuery("I001", "Cuales son los items con riesgo de quiebre?");
  console.log(result.answer);
  process.exit(0);
}
run();

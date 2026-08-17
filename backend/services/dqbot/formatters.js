function formatMoney(value) {
  const n = Number(value || 0);
  return `$${(n / 1_000_000).toFixed(1)}M`;
}

function formatTable(rows = [], fields = []) {
  if (!rows.length) return "";

  const headers = fields.map((f) => f.replace(/_/g, " ").toUpperCase());

  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
  ];

  rows.forEach((row) => {
    lines.push(
      `| ${fields
        .map((field) => {
          const value = row[field];
          if (field.includes("valor")) return formatMoney(value);
          return value ?? "-";
        })
        .join(" | ")} |`
    );
  });

  return lines.join("\n");
}

module.exports = {
  formatMoney,
  formatTable,
};
import sys
import re

file_path = r'C:\Users\dario\erp-intelligence-foundation\frontend\app\commercial-dashboard\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add "Ver Transacciones" button to UnifiedDashboardHeader
header_search = r'(<UnifiedDashboardHeader[^>]+setMetricMode={setMetricMode}\s*/>)'
header_replace = r'''\1
        <div className="absolute top-4 right-6 z-10">
          <button 
            onClick={() => setIsTransactionsOpen(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
          >
            <Activity className="w-4 h-4" /> Ver Transacciones
          </button>
        </div>'''
content = re.sub(header_search, header_replace, content)

# 2. Change TAB: CANALES to TAB: EQUIPO
canal_search = r'{\s*/\*\s*TAB: CANALES Y VENDEDORES\s*\*/\s*}\s*{activeTab === \'canal\' && \('
canal_replace = r'''{/* TAB: EQUIPO COMERCIAL */}
            {activeTab === 'equipo' && ('''
content = re.sub(canal_search, canal_replace, content)

# 3. Change TAB: MIX to TAB: CLIENTES
mix_search = r'{\s*/\*\s*TAB: MIX & PRICING \(PARETO\)\s*\*/\s*}\s*{activeTab === \'mix\' && \('
mix_replace = r'''{/* TAB: CLIENTES Y CONCENTRACION */}
            {activeTab === 'clientes' && ('''
content = re.sub(mix_search, mix_replace, content)

# 4. Wrap TAB: TRANSACCIONES in SlideOver
tx_start = content.find('{/* TAB: TRANSACCIONES */}')
tx_end = content.find('</main>', tx_start)

tx_block = content[tx_start:tx_end]
tx_block = tx_block.replace("{activeTab === 'transacciones' && (", "<SlideOver isOpen={isTransactionsOpen} onClose={() => setIsTransactionsOpen(false)} title=\"Auditoría de Transacciones\">\n")
tx_block = tx_block.replace("</motion.div>\n            )}", "</motion.div>\n            </SlideOver>")

content = content[:tx_start] + tx_block + content[tx_end:]

# 5. Fix ECharts warning for xAxis data (month_num instead of month)
content = content.replace("salesMonthly.map(m => m.month)", "salesMonthly.map(m => m.month_num)")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactored successfully")

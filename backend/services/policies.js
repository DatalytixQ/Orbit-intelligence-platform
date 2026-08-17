const sql = require('../db');

async function getPolicies(tenantId = 1, category = null) {
    let res;
    if (category) {
        res = await sql`SELECT policy_key, policy_value FROM tenant_business_policies WHERE tenant_id = ${tenantId} AND category = ${category}`;
    } else {
        res = await sql`SELECT policy_key, policy_value FROM tenant_business_policies WHERE tenant_id = ${tenantId}`;
    }
    
    const p = {};
    res.forEach(r => {
        p[r.policy_key] = r.policy_value;
    });
    return p;
}

module.exports = { getPolicies };

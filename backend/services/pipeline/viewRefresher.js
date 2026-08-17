const db = require('../../db');

/**
 * Refreshes the materialized views associated with an entity
 */
async function refreshViews(views) {
  if (!views || views.length === 0) return;
  
  for (const view of views) {
    try {
      await db.unsafe(`REFRESH MATERIALIZED VIEW public.${view}`);
    } catch (e) {
      // If it fails, maybe it's not a materialized view, just log it
      console.error(`Failed to refresh view ${view}:`, e.message);
      throw e;
    }
  }
}

module.exports = { refreshViews };

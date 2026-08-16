# Token Budget Report

**Date:** 2026-07-13

## Task Estimations
Following the schema update, the Orchestrator has estimated the following bounds:

- **N001:** 15,000 tokens (Flash)
- **N002:** 30,000 tokens (Pro - Multiple phases)
- **T001:** 10,000 tokens (Flash)
- **T002:** 25,000 tokens (Pro - Middleware extraction)
- **T003:** 15,000 tokens (Flash)
- **T004:** 10,000 tokens (Flash)
- **T005:** 8,000 tokens (Flash)
- **T006:** 35,000 tokens (Pro - Large context SOP)

## Optimization Metrics
- The `model_class` has been hardcoded per contract to ensure strict routing.
- Context injection is capped at minimum inputs.
- No task currently exceeds the 128k safety boundary.

**Status:** ✅ PASS

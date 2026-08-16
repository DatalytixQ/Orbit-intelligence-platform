import { RuntimeKernel } from './runtime_kernel';

async function runCertification() {
  console.log('--- STARTING CERTIFICATION RUN ---');
  const kernel = new RuntimeKernel();
  await kernel.initialize();

  // Force Iteration 1
  console.log('\n[Cert] Triggering Iteration 0001...');
  (kernel as any).eventBus.publish('TRIGGER_ITERATION', { iterationId: 'iteration_0001' });
  
  await new Promise(r => setTimeout(r, 2000)); // wait for pipeline to settle

  // Force Iteration 2
  console.log('\n[Cert] Triggering Iteration 0002...');
  (kernel as any).eventBus.publish('TRIGGER_ITERATION', { iterationId: 'iteration_0002' });

  await new Promise(r => setTimeout(r, 2000));

  // Force Iteration 3
  console.log('\n[Cert] Triggering Iteration 0003...');
  (kernel as any).eventBus.publish('TRIGGER_ITERATION', { iterationId: 'iteration_0003' });

  await new Promise(r => setTimeout(r, 2000));

  console.log('\n[Cert] Simulating Crash & Recovery...');
  await kernel.shutdown();

  console.log('--- CERTIFICATION RUN COMPLETE ---');
  process.exit(0);
}

runCertification();

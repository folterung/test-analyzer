import fs from 'fs';
import minimist from 'minimist';
import { Runner } from './lib/runner';

async function main() {
  const args = minimist(process.argv.slice(2), {
    string: ['command'],
    default: { repeat: 10 },
  });

  const command = args.command as string;
  const repeat = parseInt(args.repeat as string, 10) || 10;

  if (!command) {
    console.error('Error: --command is required');
    process.exit(1);
  }

  const runner = new Runner(command, repeat);
  const results = await runner.run();

  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));

  // simple summary output
  const flaky = results.tests.filter(t => t.isFlaky);
  if (flaky.length > 0) {
    console.log(`\uD83E\uDD6A Flaky Tests (${flaky.length}):`);
    for (const t of flaky) {
      console.log(` - "${t.name}" \u2014 ${t.failCount}/${repeat} failed (flakeScore: ${t.flakeScore.toFixed(0)}%)`);
    }
  } else {
    console.log('All tests passed consistently.');
  }
}

main();

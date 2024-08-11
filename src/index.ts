import { Command } from 'commander';
import fs from 'node:fs';

const program = new Command();

function loadConfig(path: string): unknown {
  const data = fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '{}';
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return {};
  }
}

const config = loadConfig('./config.json');
console.log(config);

program.command('save [name] [origin]').action((name, origin) => {
  console.log(`Saving ${name} as ${origin}`);
});

program.parse(process.argv);

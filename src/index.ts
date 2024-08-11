import { Command } from 'commander';
import fs from 'node:fs';

const program = new Command();

function loadConfig(path: string): { name?: string } {
  const data = fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '{}';
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return {};
  }
}

function saveConfig(path: string, data: { name?: string }): void {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Config saved successfully');
  } catch (e) {
    console.error('Failed to save config:', e);
  }
}

const config = loadConfig('./config.json');
config.name = 'config';
saveConfig('./config.json', config);
console.log(config);

program.command('save [name] [origin]').action((name, origin) => {
  console.log(`Saving ${name} as ${origin}`);
});

program.parse(process.argv);

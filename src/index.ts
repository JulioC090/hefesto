import ConfigManager from '@/ConfigManager';
import { Command } from 'commander';

const program = new Command();

const config = ConfigManager.load();
config.name = 'config';
ConfigManager.save(config);
console.log(config);

program.command('save [name] [origin]').action((name, origin) => {
  console.log(`Saving ${name} as ${origin}`);
});

program.parse(process.argv);

import { Command } from 'commander';

const program = new Command();

program.command('save [name] [origin]').action((name, origin) => {
  console.log(`Saving ${name} as ${origin}`);
});

program.parse(process.argv);

import ConfigManager from '@/ConfigManager';
import { Command } from 'commander';

const program = new Command();

const config = ConfigManager.load();

program.command('save [name] [origin]').action((name, origin) => {
  const boilerplate = { name, origin };
  if (!config.boilerplate) {
    config.boilerplate = [boilerplate];
  } else {
    config.boilerplate.push(boilerplate);
  }

  ConfigManager.save(config);
});

program.parse(process.argv);

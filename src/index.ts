import ConfigManager from '@/ConfigManager';
import extractRepo from '@/RepoExtractor';
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

program.command('init [boilerplate]').action((boilerplate) => {
  const projectPath = process.cwd();

  const boilerplateInfo: { name: string; origin: string } =
    config.boilerplate.find(
      ({ name }: { name: string }) => name === boilerplate,
    );

  if (!boilerplateInfo) {
    console.error(`Boilerplate "${boilerplate}" not found.`);
    return;
  }

  extractRepo(boilerplateInfo.origin, projectPath);
});

program.parse(process.argv);

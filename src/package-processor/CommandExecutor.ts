import { Command } from '@/package-processor/Command';
import ICommandExecutor from '@/protocols/ICommandExecutor';
import IContextManager from '@/protocols/IContextManager';

export default class CommandExecutor implements ICommandExecutor {
  constructor(
    private commandHandlers: { [key: string]: Command },
    private contextManager: IContextManager,
  ) {}

  async execute(command: string, args: string[]) {
    if (command in this.commandHandlers) {
      await this.commandHandlers[command](args);
      return;
    }

    if (this.contextManager.hasCommand(command)) {
      await this.contextManager.getCommand(command)(args);
      return;
    }

    throw new Error(`Command "${command}" does not exist.`);
  }
}

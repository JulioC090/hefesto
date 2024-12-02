import CopyFiles from '@/package-commands/CopyFiles';
import { Command } from '@/package-processor/Command';
import IContextManager from '@/protocols/IContextManager';
import IFileManager from '@/protocols/IFileManager';

export default function makeCommandHandlers({
  fileManager,
  contextManager,
}: {
  fileManager: IFileManager;
  contextManager: IContextManager;
}): { [key: string]: Command } {
  const copyFiles = new CopyFiles(fileManager, contextManager);

  return {
    COPY: async (args?: Array<string>) => {
      if (!args) throw new Error(`Invalid arguments to COPY command.`);
      await copyFiles.copyFiles(args);
    },
  };
}

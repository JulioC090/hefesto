import { PackageBlock } from '@/package-processor/PackageBlock';
import ICommandExecutor from '@/protocols/ICommandExecutor';
import IContextManager from '@/protocols/IContextManager';
import IPackageProcessor from '@/protocols/IPackageProcessor';

export default class PackageProcessor implements IPackageProcessor {
  constructor(
    private contextManager: IContextManager,
    private packagesBlocks: { [key: string]: PackageBlock },
    private commandExecutor: ICommandExecutor,
  ) {}

  async processPackages(packages: Array<string>) {
    packages.forEach((packageName) => {
      const packageBlock = this.packagesBlocks[packageName];

      if (!packageBlock) {
        throw new Error(`Package "${packageName}" does not exist.`);
      }

      this.contextManager.setCurrentPackage(packageName);

      packageBlock.commands.forEach(async (command) => {
        await this.commandExecutor.execute(command.command, command.args);
      });
    });
  }
}

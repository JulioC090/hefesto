import IContextManager from '@/protocols/IContextManager';
import IFileManager from '@/protocols/IFileManager';
import path from 'node:path';

export default class CopyFiles {
  constructor(
    private fileManager: IFileManager,
    private contextManager: IContextManager,
  ) {}

  async copyFiles(files: Array<string>) {
    files.forEach(async (file) => {
      const sourcePath = path.join(
        this.contextManager.props.source,
        this.contextManager.getCurrentPackage(),
        file,
      );

      const destinationPath = path.join(
        this.contextManager.props.destination,
        file,
      );

      await this.fileManager.copy(sourcePath, destinationPath);
    });
  }
}

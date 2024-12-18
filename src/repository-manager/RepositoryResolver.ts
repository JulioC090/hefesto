import IFileManager from '@/protocols/IFileManager';
import IRepositoryExtractor from '@/protocols/IRepositoryExtractor';
import IRepositoryResolver from '@/protocols/IRepositoryResolver';
import isGitHubRepoAvailable from '@/repository-manager/isGitHubRepoAvailable';
import isUrl from '@/repository-manager/isUrl';
import { Repository } from '@/repository-manager/Repository';
import path from 'node:path';

export default class RepositoryResolver implements IRepositoryResolver {
  constructor(
    private repositoryExtractor: IRepositoryExtractor,
    private fileManager: IFileManager,
  ) {}

  async resolve(repository: string): Promise<Repository | null> {
    if (!repository) return null;

    if (isUrl(repository)) {
      const isAvailable = await isGitHubRepoAvailable(repository);
      if (!isAvailable) return null;

      const path = await this.repositoryExtractor.extract(repository);
      return this.getRepositoryInfo(path);
    }

    return this.getRepositoryInfo(repository);
  }

  private async getRepositoryInfo(
    repositoryPath: string,
  ): Promise<Repository | null> {
    try {
      const mapFilePath = path.join(repositoryPath, 'hefesto.map.json');

      const mapFileContent = await this.fileManager.read(mapFilePath);
      const repositoryData: Repository = JSON.parse(mapFileContent);

      return repositoryData;
    } catch (error) {
      console.error(
        `Failed to read or process .map file in ${repositoryPath}:`,
        error,
      );
      return null;
    }
  }
}

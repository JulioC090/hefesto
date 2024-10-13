import isGitHubRepoAvailable from '@/common/isGitHubRepoAvailable';
import isUrl from '@/common/isUrl';
import { Repository } from '@/entities/Repository';
import IFileReader from '@/protocols/IFileReader';
import IRepositoryExtractor from '@/protocols/IRepositoryExtractor';
import IRepositoryResolver from '@/protocols/IRepositoryResolver';
import path from 'node:path';

export default class RepositoryResolver implements IRepositoryResolver {
  constructor(
    private repositoryExtractor: IRepositoryExtractor,
    private fileReader: IFileReader,
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

      const mapFileContent = await this.fileReader.read(mapFilePath);
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

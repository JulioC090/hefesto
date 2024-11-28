import IFileReader from '@/protocols/IFileReader';
import IRepositoryExtractor from '@/protocols/IRepositoryExtractor';
import IRepositoryResolver from '@/protocols/IRepositoryResolver';
import isGitHubRepoAvailable from '@/repository-manager/isGitHubRepoAvailable';
import isUrl from '@/repository-manager/isUrl';
import RepositoryResolver from '@/repository-manager/RepositoryResolver';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/repository-manager/isGitHubRepoAvailable');
vi.mock('@/repository-manager/isUrl');
vi.mock('fs');
vi.mock('@/protocols/IRepositoryExtractor');

describe('RepositoryResolver', () => {
  const mockExtractor: IRepositoryExtractor = {
    extract: vi.fn(),
  };

  const mockFileReader: IFileReader = {
    read: vi.fn(),
  };

  let resolver: IRepositoryResolver;

  beforeEach(() => {
    resolver = new RepositoryResolver(mockExtractor, mockFileReader);
  });

  it('should return null if repository is invalid', async () => {
    const result = await resolver.resolve('');
    expect(result).toBeNull();
  });

  it('should return null if repository is not available on GitHub', async () => {
    vi.mocked(isUrl).mockReturnValue(true);
    vi.mocked(isGitHubRepoAvailable).mockResolvedValue(false);

    const result = await resolver.resolve('https://github.com/user/repo');
    expect(result).toBeNull();
  });

  it('should resolve a repository from a URL', async () => {
    vi.mocked(isUrl).mockReturnValue(true);
    vi.mocked(isGitHubRepoAvailable).mockResolvedValue(true);
    vi.mocked(mockExtractor.extract).mockResolvedValue('/path/to/repo');

    const mockRepositoryData = {
      name: 'example-repo',
      path: '/repositories/example',
      default: { structure: 'main', context: 'default' },
      structures: ['structure1'],
      contexts: ['context1'],
      packages: ['package1'],
    };

    vi.mocked(mockFileReader.read).mockResolvedValue(
      JSON.stringify(mockRepositoryData),
    );

    const result = await resolver.resolve('https://github.com/user/repo');
    expect(result).toEqual(mockRepositoryData);
  });

  it('should handle invalid .map file', async () => {
    vi.mocked(isUrl).mockReturnValue(false);
    vi.mocked(mockFileReader.read).mockRejectedValue(
      new Error('File not found'),
    );

    const result = await resolver.resolve('/invalid/path');
    expect(result).toBeNull();
  });
});

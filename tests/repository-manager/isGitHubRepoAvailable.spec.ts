import isGitHubRepoAvailable from '@/repository-manager/isGitHubRepoAvailable';
import { describe, expect, it } from 'vitest';

describe('isGitHubRepoAvailable', () => {
  it('should return true for available GitHub repositories', async () => {
    const repoUrl = 'https://github.com/facebook/react';
    const result = await isGitHubRepoAvailable(repoUrl);
    expect(result).toBe(true);
  });

  it('should return false for non-existent GitHub repositories', async () => {
    const repoUrl = 'https://github.com/nonexistent-user/nonexistent-repo';
    const result = await isGitHubRepoAvailable(repoUrl);
    expect(result).toBe(false);
  });

  it('should return false for invalid GitHub repository URLs', async () => {
    const invalidRepoUrl = 'https://github.com/invalid/url/structure';
    const result = await isGitHubRepoAvailable(invalidRepoUrl);
    expect(result).toBe(false);
  });
});

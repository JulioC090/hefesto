import CopyFiles from '@/package-commands/CopyFiles';
import IContextManager from '@/protocols/IContextManager';
import IFileManager from '@/protocols/IFileManager';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

describe('CopyFiles', () => {
  it('should copy files to the correct destination', async () => {
    const mockFileManager = {
      copy: vi.fn(),
    } as unknown as IFileManager;

    const mockContextManager = {
      props: {
        source: '/source/path',
        destination: '/destination/path',
      },
      getCurrentPackage: vi.fn().mockReturnValue('package1'),
    } as unknown as IContextManager;

    const copyFiles = new CopyFiles(mockFileManager, mockContextManager);

    const files = ['file1.txt', 'src/file2.txt'];

    await copyFiles.copyFiles(files);

    files.forEach((file) => {
      const sourcePath = path.join('/source/path', 'package1', file);
      const destinationPath = path.join('/destination/path', file);

      expect(mockFileManager.copy).toHaveBeenCalledWith(
        sourcePath,
        destinationPath,
      );
    });

    expect(mockFileManager.copy).toHaveBeenCalledTimes(files.length);
  });
});

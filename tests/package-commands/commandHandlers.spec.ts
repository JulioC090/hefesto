import makeCommandHandlers from '@/package-commands/commandHandlersFactory';
import CopyFiles from '@/package-commands/CopyFiles';
import IContextManager from '@/protocols/IContextManager';
import IFileManager from '@/protocols/IFileManager';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/package-commands/CopyFiles');

describe('commandHandlers', () => {
  describe('COPY', () => {
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

    it('should call copyFiles with the correct arguments for COPY command', async () => {
      const mockCopyFiles = {
        copyFiles: vi.fn(),
      } as unknown as CopyFiles;

      vi.mocked(CopyFiles).mockImplementation(() => mockCopyFiles);

      const handlers = makeCommandHandlers({
        fileManager: mockFileManager,
        contextManager: mockContextManager,
      });

      const files = ['file1.txt', 'file2.txt'];
      await handlers.COPY(files);

      expect(mockCopyFiles.copyFiles).toHaveBeenCalledWith(files);
      expect(mockCopyFiles.copyFiles).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if COPY is called without arguments', async () => {
      const handlers = makeCommandHandlers({
        fileManager: mockFileManager,
        contextManager: mockContextManager,
      });

      await expect(handlers.COPY()).rejects.toThrow(
        'Invalid arguments to COPY command.',
      );
    });
  });
});

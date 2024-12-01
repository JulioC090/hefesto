import { PackageBlock } from '@/package-processor/PackageBlock';
import PackageProcessor from '@/package-processor/PackageProcessor';
import { describe, expect, it, vi } from 'vitest';

describe('PackageProcessor', () => {
  const mockContextManager = {
    setLocalVariable: vi.fn(),
    setExportedVariable: vi.fn(),
    exportVariable: vi.fn(),
    getVariable: vi.fn(),
    registerCommand: vi.fn(),
    getCommand: vi.fn(),
    setCurrentPackage: vi.fn(),
    getCurrentPackage: vi.fn(),
  };

  const mockCommandExecutor = {
    execute: vi.fn(),
  };

  it('should process packages and execute all commands', async () => {
    const mockPackagesBlocks: { [key: string]: PackageBlock } = {
      init: {
        name: 'init',
        commands: [{ command: 'COPY', args: ['.gitignore'] }],
      },
      eslint: {
        name: 'eslint',
        commands: [{ command: 'INSTALL', args: ['eslint'] }],
      },
    };

    const processor = new PackageProcessor(
      mockContextManager,
      mockPackagesBlocks,
      mockCommandExecutor,
    );

    await processor.processPackages(['init', 'eslint']);

    expect(mockContextManager.setCurrentPackage).toHaveBeenCalledWith('init');
    expect(mockContextManager.setCurrentPackage).toHaveBeenCalledWith('eslint');

    expect(mockCommandExecutor.execute).toHaveBeenCalledWith('COPY', [
      '.gitignore',
    ]);
    expect(mockCommandExecutor.execute).toHaveBeenCalledWith('INSTALL', [
      'eslint',
    ]);
  });

  it('should throw an error if a package does not exist', async () => {
    const mockPackagesBlocks: { [key: string]: PackageBlock } = {
      init: {
        name: 'init',
        commands: [{ command: 'INIT', args: ['-y'] }],
      },
    };

    const processor = new PackageProcessor(
      mockContextManager,
      mockPackagesBlocks,
      mockCommandExecutor,
    );

    await expect(processor.processPackages(['nonexistent'])).rejects.toThrow(
      'Package "nonexistent" does not exist.',
    );
  });
});

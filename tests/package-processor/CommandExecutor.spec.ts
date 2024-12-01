import CommandExecutor from '@/package-processor/CommandExecutor';
import IContextManager from '@/protocols/IContextManager';
import { describe, expect, it, vi } from 'vitest';

describe('CommandExecutor', () => {
  it('should execute the command from commandHandlers', async () => {
    const contextManager = {
      hasCommand: vi.fn(),
      getCommand: vi.fn(),
    } as unknown as IContextManager;

    const mockCommandHandler = vi.fn().mockResolvedValue(undefined);

    const executor = new CommandExecutor(
      { testCommand: mockCommandHandler },
      contextManager,
    );

    await executor.execute('testCommand', ['arg1', 'arg2']);
    expect(mockCommandHandler).toHaveBeenCalledWith(['arg1', 'arg2']);
    expect(contextManager.hasCommand).not.toHaveBeenCalled();
    expect(contextManager.getCommand).not.toHaveBeenCalled();
  });

  it('should execute the command from contextManager if not in commandHandlers', async () => {
    const mockContextCommand = vi.fn().mockResolvedValue(undefined);

    const contextManager = {
      hasCommand: vi.fn().mockReturnValue(true),
      getCommand: vi.fn().mockReturnValue(mockContextCommand),
    } as unknown as IContextManager;

    const executor = new CommandExecutor({}, contextManager);

    await executor.execute('contextCommand', ['arg1', 'arg2']);
    expect(mockContextCommand).toHaveBeenCalledWith(['arg1', 'arg2']);
    expect(contextManager.hasCommand).toHaveBeenCalledWith('contextCommand');
    expect(contextManager.getCommand).toHaveBeenCalledWith('contextCommand');
  });

  it('should throw an error if the command does not exist in commandHandlers or contextManager', async () => {
    const contextManager = {
      hasCommand: vi.fn().mockReturnValue(false),
      getCommand: vi.fn(),
    } as unknown as IContextManager;

    const executor = new CommandExecutor({}, contextManager);

    expect(
      async () => await executor.execute('nonExistentCommand', []),
    ).rejects.toThrow('Command "nonExistentCommand" does not exist.');
  });
});

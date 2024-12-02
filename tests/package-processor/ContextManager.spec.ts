import ContextManager from '@/package-processor/ContextManager';
import IContextManager from '@/protocols/IContextManager';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ContextManager', () => {
  let contextManager: IContextManager;

  beforeEach(() => {
    contextManager = new ContextManager({
      source: 'source',
      destination: 'destination',
    });
  });

  describe('setLocalVariable', () => {
    it('should set a local variable', () => {
      contextManager.setLocalVariable('testVar', 42);
      expect(contextManager.getVariable('testVar')).toBe(42);
    });
  });

  describe('setExportedVariable', () => {
    it('should set an exported variable', () => {
      contextManager.setExportedVariable('exportedVar', 'value');
      expect(contextManager.getVariable('exportedVar')).toBe('value');
    });
  });

  describe('exportVariable', () => {
    it('should export a local variable', () => {
      contextManager.setLocalVariable('localVar', 'toExport');
      contextManager.exportVariable('localVar');
      expect(contextManager.getVariable('localVar')).toEqual('toExport');
    });

    it('should throw an error if local variable does not exist', () => {
      expect(() => contextManager.exportVariable('nonExistentVar')).toThrow(
        'Variable "nonExistentVar" does not exist in local variables.',
      );
    });
  });

  describe('getVariable', () => {
    it('should retrieve a local variable', () => {
      contextManager.setLocalVariable('testVar', 100);
      expect(contextManager.getVariable('testVar')).toBe(100);
    });

    it('should retrieve an exported variable', () => {
      contextManager.setExportedVariable('exportedVar', 'hello');
      expect(contextManager.getVariable('exportedVar')).toBe('hello');
    });

    it('should throw an error if variable does not exist', () => {
      expect(() => contextManager.getVariable('nonExistentVar')).toThrow(
        'Variable "nonExistentVar" does not exist.',
      );
    });

    it('should retrieve a local variable first', () => {
      contextManager.setLocalVariable('testVar', 100);
      contextManager.setExportedVariable('testVar', 'hello');
      expect(contextManager.getVariable('testVar')).toBe(100);
    });
  });

  describe('registerCommand', () => {
    it('should register and retrieve a command', () => {
      const mockCommand = () => 'executed';
      contextManager.registerCommand('testCommand', mockCommand);
      const command = contextManager.getCommand('testCommand');
      expect(command()).toBe('executed');
    });

    it('should throw an error if command does not exist', () => {
      expect(() => contextManager.getCommand('nonExistentCommand')).toThrow(
        'Command "nonExistentCommand" does not exist.',
      );
    });
  });

  describe('hasCommand', () => {
    it('should return true if command exists', () => {
      contextManager.registerCommand('testCommand', () => {});
      expect(contextManager.hasCommand('testCommand')).toBe(true);
    });

    it('should return false if command does not exist', () => {
      expect(contextManager.hasCommand('testCommand')).toBe(false);
    });
  });

  describe('setCurrentPackage', () => {
    it('should set the current package', () => {
      contextManager.setCurrentPackage('packageA');
      expect(contextManager.getCurrentPackage()).toBe('packageA');
    });

    it('should reset local variables when changing packages', () => {
      contextManager.setLocalVariable('tempVar', 'tempValue');
      contextManager.setCurrentPackage('packageB');
      expect(() => contextManager.getVariable('tempVar')).toThrow(
        'Variable "tempVar" does not exist.',
      );
    });

    it('should throw an error if package name is empty', () => {
      expect(() => contextManager.setCurrentPackage('')).toThrow(
        'Package name cannot be empty.',
      );
    });
  });

  describe('getCurrentPackage', () => {
    it('should return the current package', () => {
      contextManager.setCurrentPackage('packageX');
      expect(contextManager.getCurrentPackage()).toBe('packageX');
    });

    it('should return null if no package is set', () => {
      expect(contextManager.getCurrentPackage()).toBe('');
    });
  });
});

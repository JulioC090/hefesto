import { Command } from '@/package-processor/Command';

export default interface IContextManager {
  setLocalVariable(key: string, value: string | number): void;
  setExportedVariable(key: string, value: string | number): void;
  exportVariable(key: string): void;
  getVariable(key: string): string | number;
  registerCommand(key: string, fn: Command): void;
  getCommand(key: string): Command;
  hasCommand(key: string): boolean;
  setCurrentPackage(packageName: string): void;
  getCurrentPackage(): string;
}

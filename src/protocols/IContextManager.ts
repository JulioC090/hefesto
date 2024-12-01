export default interface IContextManager {
  setLocalVariable(key: string, value: string | number): void;
  setExportedVariable(key: string, value: string | number): void;
  exportVariable(key: string): void;
  getVariable(key: string): string | number;
  registerCommand(key: string, fn: (...args: string[]) => unknown): void;
  getCommand(key: string): (...args: string[]) => unknown;
  setCurrentPackage(packageName: string): void;
  getCurrentPackage(): string;
}

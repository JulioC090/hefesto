import { Command } from '@/package-processor/Command';
import IContextManager from '@/protocols/IContextManager';

export default class ContextManager implements IContextManager {
  private localVariables: { [key: string]: number | string } = {};
  private exportedVariables: { [key: string]: number | string } = {};
  private exportedCommands: { [key: string]: Command } = {};
  private currentPackage: string = '';
  private registeredPackages: Array<string> = [];

  constructor() {}

  setLocalVariable(key: string, value: string | number) {
    this.localVariables[key] = value;
  }

  setExportedVariable(key: string, value: string | number) {
    this.exportedVariables[key] = value;
  }

  exportVariable(key: string) {
    if (!(key in this.localVariables)) {
      throw new Error(`Variable "${key}" does not exist in local variables.`);
    }

    this.exportedVariables[key] = this.localVariables[key];
    delete this.localVariables[key];
  }

  getVariable(key: string): string | number {
    if (key in this.localVariables) {
      return this.localVariables[key];
    }

    if (key in this.exportedVariables) {
      return this.exportedVariables[key];
    }

    throw new Error(`Variable "${key}" does not exist.`);
  }

  registerCommand(key: string, fn: Command) {
    this.exportedCommands[key] = fn;
  }

  getCommand(key: string): Command {
    if (key in this.exportedCommands) {
      return this.exportedCommands[key];
    }

    throw new Error(`Command "${key}" does not exist.`);
  }

  hasCommand(key: string): boolean {
    return key in this.exportedCommands;
  }

  setCurrentPackage(packageName: string) {
    if (!packageName) {
      throw new Error('Package name cannot be empty.');
    }

    this.localVariables = {};
    this.registeredPackages.push(packageName);
    this.currentPackage = packageName;
  }

  getCurrentPackage(): string {
    return this.currentPackage;
  }
}

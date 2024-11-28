import PackageResolver from '@/package-manager/PackageResolver';
import { PackageRule } from '@/package-manager/PackageRule';
import { describe, expect, it } from 'vitest';

describe('PackageResolver', () => {
  it('should return an empty array when no matching packages are found', async () => {
    const resolver = new PackageResolver([]);
    const result = await resolver.resolve([]);
    expect(result).toEqual([]);
  });

  it('should add "init" to activePackages when "init" rule exists', async () => {
    const resolverWithInit = new PackageResolver([{ packageName: 'init' }]);
    const result = await resolverWithInit.resolve([]);
    expect(result).toEqual(['init']);
  });

  it('should not add "init" when no "init" rule exists', async () => {
    const resolverWithoutInit = new PackageResolver([{ packageName: 'other' }]);
    const result = await resolverWithoutInit.resolve([]);
    expect(result).toEqual([]);
  });

  it('should add only valid packages from the packageRules', async () => {
    const packageRules = [{ packageName: 'init' }, { packageName: 'package1' }];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package1', 'package2', 'package3']);
    expect(result).toEqual(['init', 'package1']);
  });

  it('should activate extended packages', async () => {
    const packageRules = [
      { packageName: 'package1' },
      { packageName: 'package2', extends: ['package1'] },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package2']);
    expect(result).toEqual(['package1', 'package2']);
  });

  it('should activate all extended packages recursively', async () => {
    const packageRules = [
      { packageName: 'package1' },
      { packageName: 'package2', extends: ['package1'] },
      { packageName: 'package3', extends: ['package2'] },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package3']);
    expect(result).toEqual(['package1', 'package2', 'package3']);
  });

  it('should deactivate overwritten packages', async () => {
    const packageRules = [
      { packageName: 'package1' },
      { packageName: 'package2', overwrites: ['package1'] },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package1', 'package2']);
    expect(result).toEqual(['package2']);
  });

  it('should deactivate overwritten packages recursively', async () => {
    const packageRules = [
      { packageName: 'package1' },
      { packageName: 'package2', extends: ['package1'] },
      { packageName: 'package3', overwrites: ['package2'] },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package2', 'package3']);
    expect(result).toEqual(['package3']);
  });

  it('should deactivate overwritten packages and its extended packages', async () => {
    const packageRules = [
      { packageName: 'package1' },
      {
        packageName: 'package2',
        extends: ['package1'],
        overwrites: ['package1'],
      },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package1', 'package2']);
    expect(result).toEqual(['package2']);
  });

  it('should activate packages based on conditions and overwrite rules', async () => {
    const packageRules: Array<PackageRule> = [
      { packageName: 'package1' },
      { packageName: 'package2' },
      {
        packageName: 'package3',
        condition: (activePackages) =>
          activePackages.includes('package1') &&
          activePackages.includes('package2'),
      },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['package1', 'package2']);
    expect(result).toEqual(['package1', 'package2', 'package3']);
  });

  it('should return true', async () => {
    const packageRules: Array<PackageRule> = [
      { packageName: 'eslint' },
      { packageName: 'prettier' },
      { packageName: 'lintstaged' },
      {
        packageName: 'eslint-prettier',
        overwrites: ['eslint', 'prettier'],
        condition: (active) =>
          active.includes('eslint') && active.includes('prettier'),
      },
      {
        packageName: 'lintstaged-lint',
        extends: ['lintstaged'],
        condition: (active) =>
          active.includes('eslint') ||
          active.includes('prettier') ||
          active.includes('eslint-prettier'),
      },
    ];
    const resolver = new PackageResolver(packageRules);
    const result = await resolver.resolve(['eslint', 'prettier', 'lintstaged']);
    expect(result).toEqual([
      'lintstaged',
      'eslint-prettier',
      'lintstaged-lint',
    ]);
  });
});

import { PackageRule } from '@/package-manager/PackageRule';
import IPackageResolver from '@/protocols/IPackageResolver';

export default class PackageResolver implements IPackageResolver {
  private activePackages: Set<string> = new Set();

  constructor(private packagesRules: Array<PackageRule>) {}

  async resolve(packages: Array<string>): Promise<Array<string>> {
    if (
      this.packagesRules.some(
        (packagesRule) => packagesRule.packageName === 'init',
      )
    ) {
      this.activePackages.add('init');
    }

    packages.forEach((pkg) => this.activate(pkg));

    this.packagesRules.forEach((pkg) => {
      if (
        pkg.condition?.([...this.activePackages]) &&
        !this.activePackages.has(pkg.packageName)
      ) {
        this.activate(pkg.packageName);
      }
    });

    return [...this.activePackages];
  }

  private activate(packageName: string) {
    const packageRule = this.packagesRules.find(
      (packageRule) => packageRule.packageName === packageName,
    );

    if (!packageRule) return;

    if (packageRule.extends) {
      packageRule.extends.forEach((extend) => this.activate(extend));
    }

    if (packageRule.overwrites) {
      packageRule.overwrites.forEach((overwritten) => {
        this.desative(overwritten);
      });
    }

    this.activePackages.add(packageRule.packageName);
  }

  private desative(packageName: string) {
    if (this.activePackages.has(packageName)) {
      this.activePackages.delete(packageName);

      const overwrittenPackageRule = this.packagesRules.find(
        (packageRule) => packageRule.packageName === packageName,
      );

      if (overwrittenPackageRule?.extends) {
        overwrittenPackageRule.extends.forEach((extended) =>
          this.desative(extended),
        );
      }
    }
  }
}

export default interface IPackageProcessor {
  processPackages(packages: Array<string>): Promise<void>;
}

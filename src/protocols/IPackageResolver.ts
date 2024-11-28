export default interface IPackageResolver {
  resolve(packages: Array<string>): Promise<Array<string>>;
}

export type PackageRule = {
  packageName: string;
  overwrites?: Array<string>;
  extends?: Array<string>;
  condition?: (packages: Array<string>) => boolean;
};

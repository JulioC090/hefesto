export type PackageBlock = {
  name: string;
  commands: Array<{
    command: string;
    args: Array<string>;
  }>;
};

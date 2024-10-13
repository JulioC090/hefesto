export type Repository = {
  name: string;
  path: string;
  default: {
    structure?: string;
    context?: string;
  };
  structures: Array<string>;
  contexts: Array<string>;
  packages: Array<string>;
};

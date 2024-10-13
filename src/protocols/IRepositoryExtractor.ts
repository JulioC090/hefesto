export default interface IRepositoryExtractor {
  extract(githubUrl: string): Promise<string>;
}

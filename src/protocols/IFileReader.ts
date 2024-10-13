export default interface IFileReader {
  read(file: string): Promise<string>;
}

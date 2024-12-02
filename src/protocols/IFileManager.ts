export default interface IFileManager {
  read(file: string): Promise<string>;
  write(file: string, content: string): Promise<void>;
  copy(source: string, destination: string): Promise<void>;
}

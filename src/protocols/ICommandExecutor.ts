export default interface ICommandExecutor {
  execute(command: string, args: string[]): Promise<void>;
}

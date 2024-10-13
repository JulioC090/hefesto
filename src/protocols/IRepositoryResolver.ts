import { Repository } from '@/entities/Repository';

export default interface IRepositoryResolver {
  resolve(repository: string): Promise<Repository | null>;
}

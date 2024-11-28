import { Repository } from '@/repository-manager/Repository';

export default interface IRepositoryResolver {
  resolve(repository: string): Promise<Repository | null>;
}

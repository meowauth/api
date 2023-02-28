import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from '~/utils';
import { SignRequestEntity } from './entities';
import { SignRequest } from './models';

@Service()
export class SignRepository {
  constructor(@InjectRepository(SignRequestEntity) private signRepo: Repository<SignRequestEntity>) {}

  async createRequest(creation: Partial<SignRequest>): Promise<SignRequest> {
    const entity = await this.signRepo.save({ ...creation });
    return Object.assign(new SignRequestEntity(), entity).toModel();
  }

  async getRequest(id: number): Promise<SignRequest | undefined> {
    const entity = await this.signRepo.findOneBy({ id });
    return entity?.toModel();
  }

  async updateRequest(id: number, update: Partial<SignRequest>) {
    await this.signRepo.update({ id }, update);
  }
}

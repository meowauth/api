import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from '~/utils';
import { SignRequestEntity } from './entities';

@Service()
export class SignRepository {
  constructor(@InjectRepository(SignRequestEntity) private signRepo: Repository<SignRequestEntity>) {}
}

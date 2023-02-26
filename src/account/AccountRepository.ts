import { cloneDeep } from 'lodash';
import { Service } from 'typedi';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '~/utils';
import { NotFoundError } from '../errors';
import { AccountEntity } from './entities';
import { Account, AccountDetails } from './models';

@Service()
export class AccountRepository {
  constructor(@InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>) {}

  async create(creation: Partial<AccountEntity>): Promise<Account> {
    const created = await this.accountRepo.save(
      cloneDeep({
        ...creation,
      }),
    );
    return Object.assign(new AccountEntity(), created).toModel();
  }

  async findOne(where: FindOptionsWhere<AccountEntity>): Promise<Account | undefined> {
    const entity = await this.accountRepo.findOne({
      where,
      cache: true,
    });
    return entity?.toModel();
  }

  async details(address: string): Promise<AccountDetails> {
    const account = await this.accountRepo.findOne({ where: { address }, relations: { keys: true } });
    if (!account) {
      throw new NotFoundError(`account ${address} not found`);
    }
    return {
      ...account,
      keys: account.keys,
    };
  }
}

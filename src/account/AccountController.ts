import { Route, Tags } from '@tsoa/runtime';
import { Service } from 'typedi';
import { AccountRepository } from './AccountRepository';

@Service()
@Tags('Account')
@Route('/account/v1')
export class AccountController {
  constructor(private accountRepository: AccountRepository) {}
}

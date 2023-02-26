import { Route, Tags } from '@tsoa/runtime';
import { Service } from 'typedi';
import { SignRepository } from './SignRepository';

@Service()
@Tags('Sign')
@Route('/sign/v1')
export class SignController {
  constructor(private signRepository: SignRepository) {}

  async request() {}
}

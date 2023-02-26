import { useRequestScope } from '../utils';
import { Account } from './models';

export function getRequestAccount(): Account | undefined {
  return useRequestScope()?.get('user');
}

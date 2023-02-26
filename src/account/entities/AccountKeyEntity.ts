import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { AccountKey } from '../models';
import { AccountEntity } from './AccountEntity';

@Entity({ name: 'account_key' })
@Unique(['address', 'keyId'])
export class AccountKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.keys)
  @JoinColumn({ name: 'address' })
  account: AccountEntity;

  @Column()
  address: string;

  @Column()
  keyId: number;

  @Column()
  type: 'tablet' | 'phone' | 'web' | 'custodial';

  @Column()
  keyName: string;

  @Column({ default: false })
  isCustodial: boolean;

  @Column()
  publicKey: string;

  @Column({ nullable: true })
  privateKey?: string;

  @Column({ default: '' })
  lastUsedLocation: string;

  @UpdateDateColumn()
  lastUsedAt: Date;

  toModel(): AccountKey {
    return this;
  }
}

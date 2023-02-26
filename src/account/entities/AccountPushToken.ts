import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './AccountEntity';

@Entity({ name: 'account_push_token' })
export class AccountPushToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.keys)
  @JoinColumn({ name: 'address' })
  account: AccountEntity;

  @Column()
  address: string;

  @Column()
  pushToken: string;

  @Column()
  deviceLocale: string;

  @CreateDateColumn()
  createdAt: Date;
}

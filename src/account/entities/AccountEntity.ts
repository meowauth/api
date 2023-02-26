import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../models';
import { AccountKeyEntity } from './AccountKeyEntity';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryColumn()
  address: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column()
  alias: string;

  @OneToMany(() => AccountKeyEntity, (key) => key.account)
  keys: AccountKeyEntity[];

  @Column()
  firebaseUid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toModel(): Account {
    return {
      address: this.address,
      alias: this.alias,
      profileImage: this.profileImage,
    };
  }
}

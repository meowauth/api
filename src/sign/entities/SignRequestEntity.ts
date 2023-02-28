import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { QuorumEntry, SignRequest } from '../models';

@Entity({ name: 'sign_request' })
export class SignRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ default: 'in-wait' })
  status: 'in-wait' | 'approved';

  @Column()
  displayType: 'add-key' | 'revoke-key' | 'nft-send' | 'ft-send' | 'general-tx';

  @Column('simple-json')
  displayMetadata: { [k: string]: string };

  @Column('text')
  payload: string;

  @Column({ type: 'simple-json', default: [] })
  quorum: QuorumEntry[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toModel(): SignRequest {
    return this;
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column()
  displayName: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  avatar_hash: string;

  @Column({ default: null })
  description: string;

  @CreateDateColumn()
  CreateDate: Date;

  @UpdateDateColumn()
  UpdateDate: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { TypePost } from '../enum/post-type.enum';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  key: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  hash: string;

  @Column()
  type: TypePost;

  @ManyToOne(() => Profile, (profile) => profile.posts)
  profile: Profile;
}

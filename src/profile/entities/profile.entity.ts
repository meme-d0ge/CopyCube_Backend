import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];

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

  @Column({ default: false })
  deleted: boolean;
}

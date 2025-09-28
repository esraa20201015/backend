import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './application.entity';
import { BaseRecruitmentEntityFields } from './base.entity';
import { User } from '../../admins/entities/user.entity';

@Entity( 'profiles')
export class Profile extends BaseRecruitmentEntityFields {
  @Column({ length: 255 })
  personalSummary: string;

  @Column('text')
  skills: string;

  @Column('text')
  experience: string;

  @Column('text')
  education: string;

  //  CV as base64
  @Column({ type: 'text', nullable: true })
  cvFile: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({nullable: true})
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Application, (application) => application.profile)
  applications: Application[];
}

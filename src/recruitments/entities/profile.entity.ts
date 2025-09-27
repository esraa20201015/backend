import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Application, (application) => application.profile)
  applications: Application[];
  userId: any;
}

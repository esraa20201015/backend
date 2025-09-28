// src/recruitments/entities/opportunity.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { BaseRecruitmentEntityFields } from './base.entity';

@Entity( 'opportunities')
export class Opportunity extends BaseRecruitmentEntityFields {
  @Column({ length: 150 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  jobType: string; // full-time, part-time, contract, freelance, internship,remote,hybrid,on-site

  @Column({ nullable: true })
  salaryRange: string;

  @Column()
  departmentId: number;

  @Column({ default: 'external' })
  publishScope: 'internal' | 'external';

  @OneToMany(() => Application, (application) => application.opportunity)
  applications: Application[];
}

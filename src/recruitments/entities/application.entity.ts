import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Opportunity } from './opportunity.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.applications)
  profile: Profile;

  @ManyToOne(() => Opportunity, (opportunity) => opportunity.applications)
  opportunity: Opportunity;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  dateApplied: Date;
}

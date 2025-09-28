import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Opportunity } from './opportunity.entity';
import { BaseRecruitmentEntityFields } from './base.entity';

@Entity( 'applications')
export class Application extends BaseRecruitmentEntityFields {
  @Column()
  profileId: number;

  @Column()
  opportunityId: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  })
  applicationStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateApplied: Date;

  @ManyToOne(() => Profile, (profile) => profile.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ManyToOne(() => Opportunity, (opportunity) => opportunity.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'opportunityId' })
  opportunity: Opportunity;
}

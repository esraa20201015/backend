import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseRecruitmentEntityFields {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Column({ nullable: true })
  created_by?: string;

  @Column({ nullable: true })
  last_updated_by?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generated_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_updated_date: Date;
}

import { BaseEntity } from 'src/common/entities/base.entity';
import { ActivityType } from 'src/common/enums/app.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

// src/modules/activity/entities/activity-log.entity.ts
@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column()
  action: string;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;
}

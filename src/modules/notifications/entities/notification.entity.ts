// src/modules/notifications/entities/notification.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  NotificationType,
  NotificationChannel,
} from 'src/common/enums/app.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date;

  @Column({ type: 'json', nullable: true })
  metadata: {
    orderId?: string;
    paymentId?: string;
    productId?: string;
    link?: string;
    actionType?: string;
  };
}

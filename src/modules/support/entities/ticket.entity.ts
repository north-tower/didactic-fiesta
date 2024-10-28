import { BaseEntity } from 'src/common/entities/base.entity';
import { TicketPriority, TicketStatus } from 'src/common/enums/app.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TicketMessage } from './ticket-message.entity';

// src/modules/support/entities/ticket.entity.ts
@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @OneToMany(() => TicketMessage, (message) => message.ticket)
  messages: TicketMessage[];
}

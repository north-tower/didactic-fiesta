import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from 'src/modules/users/entities/user.entity';

// src/modules/support/entities/ticket-message.entity.ts
@Entity('ticket_messages')
export class TicketMessage extends BaseEntity {
  @Column({ type: 'uuid' })
  ticketId: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages)
  ticket: Ticket;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isStaffReply: boolean;
}

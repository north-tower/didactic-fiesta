// src/modules/auth/entities/refresh-token.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  token: string;

  @Column()
  expires: Date;

  @Column({ default: false })
  revoked: boolean;

  @Column({ nullable: true })
  revokedAt: Date;

  @Column({ nullable: true })
  replacedByToken: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ipAddress: string;

  @BeforeInsert()
  setExpires() {
    const expirationSeconds = 60 * 60 * 24 * 7; // 7 days
    this.expires = new Date(Date.now() + expirationSeconds * 1000);
  }
}

// src/modules/settings/entities/store-settings.entity.ts

import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('store_settings')
export class StoreSettings extends BaseEntity {
  @Column({ default: 'Shopeazz' })
  storeName: string;

  @Column({ type: 'json' })
  contact: {
    email: string;
    phone: string;
    address: string;
  };

  @Column({ type: 'simple-array' })
  supportedPaymentMethods: string[];

  @Column({ type: 'json' })
  operationalHours: {
    start: string;
    end: string;
    timezone: string;
  };

  @Column({ default: true })
  isMaintenanceMode: boolean;
}

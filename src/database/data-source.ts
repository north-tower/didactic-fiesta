// src/database/data-source.ts
import { DataSource } from 'typeorm';
import { Company } from '../modules/companies/entities/company.entity';
import { User } from '../modules/users/entities/user.entity';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { PaymentTransaction } from 'src/modules/payments/entities/payment-transaction.entity';
import { PaymentMethod } from 'src/modules/payments/entities/payment-method.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { MediaFolder } from 'src/modules/media/entities/media-folder.entity';
import { MediaVariant } from 'src/modules/media/entities/media-variant.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { ReviewMetric } from 'src/modules/reviews/entities/review-metric.entity';
import { ReviewReply } from 'src/modules/reviews/entities/review-reply.entity';
import { SalaryDeduction } from 'src/modules/payroll/entities/salary-deduction.entity';
import { NotificationEntity } from 'src/modules/notifications/entities/notification.entity';
import { DeductionSchedule } from 'src/modules/payroll/entities/deduction-schedule.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { CartItem } from 'src/modules/cart/entities/cart-item.entity';
import { PayrollSettings } from 'src/modules/payroll/entities/payroll-settings.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'mhki',
  password: '12345678',
  database: 'shopeazz_db',
  synchronize: false,
  logging: true,
  entities: [Company, User, RefreshToken, Address, Order, OrderItem, Product,PaymentTransaction , PaymentMethod, Category, Seller,Media, MediaFolder, MediaVariant, Review, ReviewMetric, ReviewReply,
     SalaryDeduction,NotificationEntity, DeductionSchedule, Cart, CartItem, PayrollSettings
    ,
  ],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});

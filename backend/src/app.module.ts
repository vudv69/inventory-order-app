import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './config/auth.guard.authen';
import { RolesGuard } from './config/auth.guard.author';
import { UserThrottlerGuard } from './config/user-throttller.guard';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.schema';
import { Order } from './order/order.schema';
import { OrderItem } from './order/order_item.schema';
import { UserModule } from './user/user.module';
import { User } from './user/user.schema';
import { jwtConstants } from './utils/auth.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 3600000,
          limit: 1000,
        },
      ],
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [User, Product, Order, OrderItem],
      synchronize: true,
    }),

    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard,
    },
  ],
})
export class AppModule {}

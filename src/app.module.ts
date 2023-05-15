import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import { ProductsModule } from './products/products.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CartModule,
    ProductsModule
  ]
})
export class AppModule { }

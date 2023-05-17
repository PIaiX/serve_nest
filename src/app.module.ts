import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { OrdersModule } from './orders/orders.module'
import { CategoriesModule } from './categories/categories.module'
import { SubcategoriesModule } from './subcategories/subcategories.module'
import { CitiesModule } from './cities/cities.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    CategoriesModule,
    SubcategoriesModule,
    CitiesModule,
    ProfilesModule
  ]
})
export class AppModule { }

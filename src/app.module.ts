import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { OrdersModule } from './orders/orders.module'
import { CategoriesModule } from './categories/categories.module'
import { SubcategoriesModule } from './subcategories/subcategories.module'
import { CitiesModule } from './cities/cities.module'
import { ProfilesModule } from './profiles/profiles.module'
import { SpecialtiesModule } from './specialties/specialties.module'
import { CurrenciesModule } from './currencies/currencies.module'
import { MessagesModule } from './messages/messages.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    CategoriesModule,
    SubcategoriesModule,
    CitiesModule,
    ProfilesModule,
    SpecialtiesModule,
    CurrenciesModule,
    MessagesModule
  ]
})
export class AppModule { }

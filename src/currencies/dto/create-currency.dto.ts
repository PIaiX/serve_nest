import { PickType } from "@nestjs/swagger"
import { Currency } from "../entities/currency.entity"

// --------------------------------------------------------------------------------

export class CreateCurrencyDto extends PickType(Currency, ['id'] as const) { }

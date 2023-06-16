import { PickType } from "@nestjs/swagger"
import { Offer } from "../entities/specialty.entity"

// --------------------------------------------------------------------------------

export class CreateOfferDto extends PickType(Offer, ['title', 'description', 'images', 'price', 'priceUnit', 'currencyId']) { }
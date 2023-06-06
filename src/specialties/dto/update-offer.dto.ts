import { PartialType, PickType } from "@nestjs/swagger"
import { CreateOfferDto } from "./careste-offer.dto"

// --------------------------------------------------------------------------------

export class UpdateOfferDto extends PartialType(CreateOfferDto) { }
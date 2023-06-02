import { PartialType } from '@nestjs/swagger'
import { CreateProfileReviewDto } from './create-profile-review.dto'

// --------------------------------------------------------------------------------

export class UpdateProfileReviewDto extends PartialType(CreateProfileReviewDto) { }

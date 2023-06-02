import { OmitType, PickType } from "@nestjs/swagger"
import { ProfileReview } from "../entities/profile-review.entity"

// --------------------------------------------------------------------------------

export class CreateProfileReviewDto extends PickType(ProfileReview, ['rating', 'review'] as const) {
    subcategoryId: number
}

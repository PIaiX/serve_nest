import { OmitType } from "@nestjs/swagger"
import { OrderResponse } from "../entities/order.entity"

export class CreateOrderResponseDto extends OmitType(OrderResponse, ['userId', 'orderId'] as const) { }

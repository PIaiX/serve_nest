import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CurrenciesService } from './currencies.service'
import { CreateCurrencyDto } from './dto/create-currency.dto'
import { UpdateCurrencyDto } from './dto/update-currency.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { Roles } from 'src/_common/guards/roles.decorator'

// --------------------------------------------------------------------------------

@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    create(@Body() createCurrencyDto: CreateCurrencyDto) {
        return this.currenciesService.create(createCurrencyDto)
    }

    @Get()
    findAll() {
        return this.currenciesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.currenciesService.findOne(+id)
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
        return this.currenciesService.update(+id, updateCurrencyDto)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.currenciesService.remove(+id)
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { AuthGuard } from 'src/_common/guards/auth.guard'
import { Roles } from 'src/_common/guards/roles.decorator'

// --------------------------------------------------------------------------------

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    create(@Body() createCityDto: CreateCityDto) {
        return this.citiesService.create(createCityDto)
    }

    @Get()
    findAll() {
        return this.citiesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.citiesService.findOne(+id)
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
        return this.citiesService.update(+id, updateCityDto)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.citiesService.remove(+id)
    }
}

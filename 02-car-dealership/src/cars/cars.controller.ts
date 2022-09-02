import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update.car.dto';

@Controller('cars')
//@UsePipes(ValidationPipe) Pipe a nivel controller (tampoco recomendable)

export class CarsController {
    constructor(
        private readonly carsService:CarsService
    ){}

    @Get()
    getAllCars() {
        return this.carsService.findAll()
    }

    @Get('/:id')
    getCarById(@Param('id', ParseUUIDPipe) id:string){
        // console.log({id})
        return this.carsService.findOneById(id) // el mas para pasarlo a numero
    }

    @Post()
    //@UsePipes(ValidationPipe) Pipe a nivel mas bajo (no recomendable)
    createCar(@Body() createCarDto:CreateCarDto){
        return this.carsService.create(createCarDto);
    }

    @Patch('/:id')
    updateCar(
        @Param('id', ParseUUIDPipe) id:string, 
        @Body() updateCarDto:UpdateCarDto)
    {
        return this.carsService.update(id, updateCarDto);
    }

    @Delete('/:id')
    deleteCar(@Param('id', ParseUUIDPipe) id:string){
        return this.carsService.delete(id)
    }
}

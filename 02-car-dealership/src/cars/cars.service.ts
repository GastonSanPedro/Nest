import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {ICars} from './Interfaces/car.interface';
import {v4 as uuid} from 'uuid'
import { CreateCarDto, UpdateCarDto } from './dto'



@Injectable()
export class CarsService {   
    private cars:ICars []= [
        // {
        //     id:uuid(),
        //     brand:'Toyota',
        //     model:'Corolla'
        // },
        // {
        //     id:uuid(),
        //     brand:'Honda',
        //     model:'Civic'
        // },
        // {
        //     id:uuid(),
        //     brand:'Jee',
        //     model:'Cherokee'
        // }
    ];

    findAll(){
        return this.cars
    }
    findOneById(id:string){
        const car =this.cars.find(car=> car.id ===id);
        if(!car) throw new NotFoundException(`Car with id ${id} not found `);
        return car
    }
    create(createCarDto:CreateCarDto){ //puedo hacer distructuring tambn
        const newCar:ICars= {
            id: uuid(),
            ...createCarDto
            // brand: createCarDto.brand,
            // model: createCarDto.model
        }
        this.cars.push(newCar);
        return newCar
    }
    update(id:string, updateCarDto:UpdateCarDto){
        let carDB:ICars= this.findOneById(id)
        if(updateCarDto.id && updateCarDto.id !== id){
            throw new BadRequestException('Car id is not valid inside body')
        }

        this.cars = this.cars.map(car=>{
            if(car.id === id) {
            carDB={...carDB, ...updateCarDto,id,}
            return carDB
            }
            return car   
        })
        return carDB;
    }
    delete(id:string){
        let carDB:ICars= this.findOneById(id)
        this.cars = this.cars.filter(car => car.id !== id)
    }

    fillCarsWithSeedData(cars: ICars[]){
        this.cars = cars;
    }

}

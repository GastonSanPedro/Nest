import { ICars } from "src/cars/Interfaces/car.interface";
import { v4 as uuid } from 'uuid';


export const CARS_SEED: ICars[] = [
    {
        id:uuid(),
        brand:'Toyota',
        model:'Corolla'
    },
    {
        id:uuid(),
        brand:'Honda',
        model:'Civic'
    },
    {
        id:uuid(),
        brand:'Jee',
        model:'Cherokee'
    }
]
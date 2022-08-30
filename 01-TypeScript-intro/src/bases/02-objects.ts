import { age } from './01-types';
export const pokemonsIds= [1,20,30,34,66]

interface Pokemon{
    id:number,
    name:string,
    age:number,
    power?: number
}
export const bulbasaur:Pokemon ={
    id:1,
    name: 'Bulbasaur',
    age:23
}

export const charmander:Pokemon ={
    id: 4,
    name: 'Charmander',
    age: 30,
    power: 100
}

export const pokemons:Pokemon[]=[]
pokemons.push(bulbasaur, charmander)

console.log(pokemons)
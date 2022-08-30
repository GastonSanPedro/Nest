import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface';
import { PokeApiAdapter, PokeAapiFetchAdapter, HttpAdapter } from '../api/pokeApiAdapter';

export class Pokemon {
    get imgUrl():string{
        return `https://pokemon.com/${this.id}.jpg`
    }
    constructor(
        public readonly id: number, 
        public name: string,
        //TODO:INYECTAR DEPENDENCIAS
        private readonly http:HttpAdapter
        ){}

        public scream(){
            console.log(`${this.name.toUpperCase()}!!!`)
        }

        speak(){ //si pongo private solo podemos utilizarlo dentro de la clase
            console.log(`${this.name}, ${this.name}`)
        }

        async getMoves():Promise<Move[]>{
            const data= await this.http.get<PokeapiResponse>(`https://pokeapi.co/api/v2/pokemon/4`)
            console.log(data.moves)
            return data.moves
        }
}

const pokeApiAxios= new PokeApiAdapter();
const pokeApiFetch = new PokeAapiFetchAdapter();

export const charmander = new Pokemon(4, "Charmander", pokeApiAxios);

charmander.getMoves()
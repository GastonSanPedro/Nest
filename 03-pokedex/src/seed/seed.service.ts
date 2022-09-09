import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // data.results.forEach((pokemons) => {   Esta es una manera de mostrarlos o la otra es con distructuring
    //   console.log(pokemons.name, pokemons.url);
    // });

    // INSERTANDO DATOS UNO A UNO -------- (no eficiente) De esta manera espera a insertar pokemon uno a uno y es muy lento para insertar muchos datos por eso se usa el Promise.all
    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];

    //   const pokemon = await this.pokemonModel.create({ name, no });
    //   return pokemon;
    // });

    // INSERTANDO DATOS CON PROMISE.ALL -----Hace multiples inserciones (no tan eficiente) ----------------------------

    // const insertPromisesArray = [];

    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];

    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    // });

    // await Promise.all(insertPromisesArray);

    //--------------------------------------------------------------------------------

    // FORMA MAS EFICIENTE ------------- INSERTANDO TODOS LOS DATOS DE UNA SOLA VEZ

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}

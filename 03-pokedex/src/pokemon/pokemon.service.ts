import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //By no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }
    //By MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //By name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }
    //not found
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no #${term} not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto }; //para que devuelva el pokemon actualizado y no el anterior
    } catch (error) {
      this.handleException(error);
    }
  }
  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      //cuando consologeas error, ves que el error 11000 es cuando el registro ya existe en la base de dates
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Cant't update Pokemons - Check server logs`,
    );
  }
}

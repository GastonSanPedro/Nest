import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose/dist';
import { isValidObjectId, Model } from 'mongoose';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto; //seteo por defecot un numero si no viene
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v'); //sort({no:1}) para que ordene por numero de pokemon, select para que no devuelva el campo __v
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
  async remove(id: string) {
    //en el caso de que no validaramos si el id es de mongo y se pudiera eliminar por varias cosas
    // return { id };
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne(); //para borrar un registro de la base de datos se usa deleteOne o deleteMany si se quieren borrar varios registros a la vez

    //ASI TIRARIA UN STATUS 200 MIENTRAS SEA UN ID DE MONGO, INCLUSO SI EL ID NO EXISTE
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    // return result;

    const result = await this.pokemonModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    return;
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

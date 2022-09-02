import { IsString, MinLength } from "class-validator";

export class CreateCarDto{

    @IsString({message:`The brand most be a cool string`}) //mensaje personalizado
    readonly brand: string;

    @IsString() //mensaje predeterminado (bastante bueno)
    @MinLength(4)
    readonly model: string;
}
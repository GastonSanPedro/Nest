import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateCarDto{

    @IsString()
    @IsUUID()
    @IsOptional()
    readonly id?: string;

    @IsOptional()
    @IsString({message:`The brand most be a cool string`}) //mensaje personalizado
    readonly brand?: string;

    @IsOptional()
    @IsString() //mensaje predeterminado (bastante bueno)
    @MinLength(4)
    readonly model?: string;
}
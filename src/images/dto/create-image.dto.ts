import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail,} from "class-validator";


export class CreateImageDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    file: string;
}

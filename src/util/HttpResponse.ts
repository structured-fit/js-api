import { IsDefined, IsNumber, IsString, Min, Max, MinLength, MaxLength } from "class-validator";

export class HttpResponse {

    /**
     * The HTTP status code of the error.
     */
    @IsDefined()
    @IsNumber()
    @Min(0)
    @Max(599)
    statusCode: number;

    /**
     * The name of the error code.
     */
    @IsDefined()
    @IsString()
    @MinLength(2)
    @MaxLength(128)
    error: string;


    constructor(statusCode: number, error: string) {
        this.statusCode = statusCode;
        this.error = error;
    }

}

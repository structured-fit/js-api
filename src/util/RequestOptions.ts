import { IsDefined, IsNumber, IsString, Min } from "class-validator";

export interface RequestOptionsObject {
    responseTimeout: number;
    deadlineTimeout: number;
    prefix?: string;
}

export const defaultRequestOptions: RequestOptionsObject = {
    responseTimeout: 0,
    deadlineTimeout: 0,
    prefix: "https://structured.fit",
};

export class RequestOptions {

    static create(options: RequestOptionsObject): RequestOptions {
        return Object.assign(new RequestOptions(), defaultRequestOptions, options);
    }

    @IsDefined()
    @IsNumber()
    @Min(0)
    responseTimeout: number;

    @IsDefined()
    @IsNumber()
    @Min(0)
    deadlineTimeout: number;

    @IsDefined()
    @IsString()
    prefix: string;

}

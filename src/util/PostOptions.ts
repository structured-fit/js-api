import { RequestOptions, RequestOptionsObject, defaultRequestOptions } from "./RequestOptions";

export interface PostOptionsObject extends RequestOptionsObject {
}

export const defaultPostOptions: PostOptionsObject = {
    ...defaultRequestOptions,
}

export class PostOptions extends RequestOptions {

    static create(options: PostOptionsObject): RequestOptions {
        return Object.assign(new RequestOptions(), defaultPostOptions, options);
    }

}

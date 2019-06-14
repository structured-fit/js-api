import "reflect-metadata";
import { ValidationError } from "class-validator";
import { transformAndValidate, transformAndValidateSync } from "class-transformer-validator";
import { Response } from "superagent";
import { ApiRequest } from "./ApiRequest";
import { PostOptions } from "./PostOptions";
import { ClassType } from "./ClassType";
import Future, { FutureInstance, encaseP, parallel, chain, both, reject, resolve, attemptP, mapRej, map } from "fluture";
import { ResponseValidationError } from "./ResponseValidationError";
import { TimeoutError } from "./TimeoutError";
import { validate, WrappedValidationErrors } from "./validate";
import { BodyRequiredError } from "./BodyRequiredError";
import { WrappedError } from "./WrappedError";

export abstract class PostRequest<Options extends PostOptions, RequestBody extends string | object, ResponseBody extends object, ErrorBody extends object> extends ApiRequest<Options, ResponseBody, ErrorBody> {

    private body: RequestBody;

    constructor(options: Options) {
        super(options);
    }

    public post(body: RequestBody): this {
        this.body = body;
        return this;
    }

    /**
     * Executes the defined request.
     * 
     * ## Rejections
     * 
     * - {@link BodyRequiredError} if the body has not been provided.
     * - {@link ValidationError[]} if the supplied body doesn't match {@link RequestBody} or the options don't match {@link PostOptions}
     * - {@link TimeoutError} if the request times out
     * - {@link ErrorBody}/{@link ErrorBody[]} if the server returns an expected error
     * - {@link ResponseValidationError} if the response doesn't match the expected {@link ResponseBody}
     */
    public request(): FutureInstance<BodyRequiredError | WrappedValidationErrors | TimeoutError | WrappedError<ErrorBody> | ResponseValidationError, ResponseBody> {
        const hasBody: FutureInstance<BodyRequiredError, RequestBody> = Future((reject, resolve) => {
            if(!this.body) {
                return reject(new BodyRequiredError("Must provide body."));
            }
            return resolve(this.body);
        });
        const validateBody: FutureInstance<BodyRequiredError | WrappedValidationErrors, void> = hasBody.pipe (chain (body => {
            if(typeof body !== "object") {
                return Future((reject, resolve) => resolve());
            }
            return validate(body);
        }));
        const validation: FutureInstance<BodyRequiredError | WrappedValidationErrors, void[]> = parallel<BodyRequiredError | WrappedValidationErrors, void> (Infinity) ([
            validateBody,
            validate(this.options),
        ]);
        const response: FutureInstance<BodyRequiredError | WrappedValidationErrors | TimeoutError, Response> = validation
            .pipe (chain (encaseP(() => {
                const initial = this
                    .getRequest()
                    .post(this.url())
                    .send(this.body);
                const modified = this.modifyRequest(initial);
                return modified
                    .catch(err => {
                        if(err.timeout) {
                            throw new TimeoutError();
                        }
                        throw err;
                    })
                    .then(data => data);
            })));
        const output = response
            .pipe (chain (response => this.handleErrorResponse(response)))
            .pipe (chain (response => this.transformResponseBody(response)));
        return output;
    }

    protected abstract getURL(): string;

    protected abstract getResponseBodyClass(): ClassType<ResponseBody>;

    protected abstract getErrorBodyClass(): ClassType<ErrorBody>[];

    private url(): string {
        return this.getURL();
    }

    private handleErrorResponse(response: Response): FutureInstance<BodyRequiredError | WrappedValidationErrors | TimeoutError | WrappedError<ErrorBody> | ResponseValidationError, Response> {
        if(!response.error) {
            return resolve(response);
        }
        let error: ValidationError[];
        for (const ErrorBodyClass of this.getErrorBodyClass()) {
            try {
                const body: ErrorBody | ErrorBody[] = transformAndValidateSync(ErrorBodyClass, response.body);
                if(!Array.isArray(body)) {
                    return reject(new WrappedError<ErrorBody>(body));
                } else if(body.length === 1) {
                    return reject(new WrappedError<ErrorBody>(body[0]));
                }
            } catch (e) {
                error = e;
                continue;
            }
        }
        return reject(new ResponseValidationError("error", error));
    }

    private transformResponseBody(response: Response): FutureInstance<BodyRequiredError | WrappedValidationErrors | TimeoutError | WrappedError<ErrorBody> | ResponseValidationError, ResponseBody> {
        return attemptP(() => transformAndValidate(this.getResponseBodyClass(), response.body))
            .pipe (map ((body: ResponseBody | ResponseBody[]) => {
                if(!Array.isArray(body)) {
                    return body;
                } else if(body.length > 0) {
                    return body[0];
                } else {
                    throw new Error("Got back multiple responses when only looking for one.");
                }
            }))
            .pipe (mapRej<ValidationError[], ResponseValidationError, ResponseBody>
                (e => (new ResponseValidationError("data", e)))
            );
    }

}

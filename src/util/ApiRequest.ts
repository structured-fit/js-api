import * as request from "superagent";
import { RequestOptions } from "./RequestOptions";
import { ValidationError } from "class-validator";

export abstract class ApiRequest<Options extends RequestOptions, ResponseBody, ErrorBody> {

    protected progressHandler: (event: request.ProgressEvent) => void;

    constructor(protected readonly options: Options) {
    }

    public progress(handler: (event: request.ProgressEvent) => void): this {
        this.progressHandler = handler;
        return this;
    }

    protected modifyRequest(request: request.SuperAgentRequest): request.SuperAgentRequest {
        if(this.progressHandler) {
            request = request.on("progress", this.progressHandler);
        }
        return request
            .timeout({
                response: this.options.responseTimeout,
                deadline: this.options.deadlineTimeout,
            });
    }

    public prefix(): string {
        return this.options.prefix;
    }

    /**
     * Get the request library.  Allows for mock servers during testing.
     */
    protected getRequest(): request.SuperAgent<request.SuperAgentRequest> {
        return request;
    }

}

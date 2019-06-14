/**
 * Promises/Futures must be rejected with instances of {@link Error},
 * but response bodies are often incompatible with {@link Error} classes (e.g. {@link ValidationBadRequest}).
 * 
 * Children of {@link ApiRequest} can instead reject with a {@link WrappedError} that contains the response body.
 */
export class WrappedError<T> extends Error {

    constructor(public readonly child: T, message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

}

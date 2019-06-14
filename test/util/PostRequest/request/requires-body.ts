import test from "ava";
import { PasswordAuthLogin } from "../../../../src/auth/password/login";
import { PostOptions } from "../../../../src/util/PostOptions";
import { promise, mapRej } from "fluture";
import { BodyRequiredError } from "../../../../src/util/BodyRequiredError";
import { WrappedError } from "../../../../src/util/WrappedError";

test("throws BodyRequiredError", async t => {
    t.plan(1);
    const options = PostOptions.create({
        deadlineTimeout: 0,
        responseTimeout: 0,
    });
    const err: WrappedError<BodyRequiredError> = await t.throwsAsync(new PasswordAuthLogin(options).request().pipe (promise), BodyRequiredError);
});

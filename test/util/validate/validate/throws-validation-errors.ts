import test from "ava";
import { validate } from "../../../../src/util/validate";
import { PostOptions } from "../../../../src/util/PostOptions";
import { promise, mapRej } from "fluture";

test("validation error", async t => {
    const validation = validate(PostOptions.create({
            deadlineTimeout: -1,
            responseTimeout: -1,
        }))
        .pipe (mapRej (e => {
            throw new Error();
        }));
    await t.throwsAsync(() => validation.pipe (promise));
});

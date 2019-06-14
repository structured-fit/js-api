import test from "ava";
import { PasswordAuthLogin } from "../../../../src/auth/password/login";
import { PostOptions } from "../../../../src/util/PostOptions";

test("is URL", t => {
    const api = new PasswordAuthLogin(PostOptions.create({
        responseTimeout: 0,
        deadlineTimeout: 0,
    }));
    t.is(api.prefix().substr(0,4), "http");
});

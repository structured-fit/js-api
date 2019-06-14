import test from "ava";
import { RequestOptions } from "../../../../../src/util/RequestOptions";

test("creates options", t => {
    const options = RequestOptions.create({
        responseTimeout: 0,
        deadlineTimeout: 100,
    });
    t.is(options.deadlineTimeout, 100);
});

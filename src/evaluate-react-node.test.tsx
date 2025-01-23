import { expect, test } from "vitest";
import { evaluateReactNode } from "./evaluate-react-node";
import React from "react";

test("evaluateReactNode simple types.", () => {
    const testString = "string";
    const testNumber = 123;
    const testBoolean = true;
    const testNull = null;
    const testUndefined = undefined;

    expect(evaluateReactNode(testString)).toBe(testString);
    expect(evaluateReactNode(testNumber)).toBe(testNumber);
    expect(evaluateReactNode(testBoolean)).toBe(testBoolean);
    expect(evaluateReactNode(testNull)).toBe(testNull);
    expect(evaluateReactNode(testUndefined)).toBe(testUndefined);
});

test("evaluateReactNode html", () => {
    const url = "https://github.com/geon/react-node-diff";
    const anchor = <a href={url}>Fork me</a>;
    expect(evaluateReactNode(anchor)).toBe(anchor);
});

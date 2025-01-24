import { expect, test } from "vitest";
import { diffReactNode } from "./diff-react-node";
import React from "react";

test("diffReactNode simple", () => {
    expect(diffReactNode("string", "string")).toBe(null);
    expect(diffReactNode(123, 123)).toBe(null);
    expect(diffReactNode(true, true)).toBe(null);
    expect(diffReactNode(null, null)).toBe(null);
    expect(diffReactNode(undefined, undefined)).toBe(null);

    expect(diffReactNode("strong", "string")).toStrictEqual({
        type: "setNode",
        setNode: "string",
    });
    expect(diffReactNode(321, 123)).toStrictEqual({
        type: "setNode",
        setNode: 123,
    });
    expect(diffReactNode(false, true)).toStrictEqual({
        type: "setNode",
        setNode: true,
    });
    expect(diffReactNode(undefined, null)).toStrictEqual({
        type: "setNode",
        setNode: null,
    });
    expect(diffReactNode(null, undefined)).toStrictEqual({
        type: "setNode",
        setNode: undefined,
    });
});

test("diffReactNode simple vs intrinsic", () => {
    expect(diffReactNode(<div />, <div />)).toStrictEqual(null);
    expect(diffReactNode("string", <div />)).toStrictEqual({
        type: "setNode",
        setNode: <div />,
    });
});

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

test("diffReactNode intrinsic vs intrinsic", () => {
    expect(diffReactNode(<span />, <div />)).toStrictEqual({
        type: "setNode",
        setNode: <div />,
    });
});

test("diffReactNode intrinsic key", () => {
    expect(diffReactNode(<div key="same" />, <div key="same" />)).toStrictEqual(
        null
    );
    expect(
        diffReactNode(<div key="old key" />, <div key="new key" />)
    ).toStrictEqual({
        type: "setNode",
        setNode: <div key="new key" />,
    });
});

test("diffReactNode add child", () => {
    expect(diffReactNode(<p>same</p>, <p>same</p>)).toStrictEqual(null);
    expect(diffReactNode(<p></p>, <p>new child</p>)).toStrictEqual({
        type: "setNode",
        setNode: <p>new child</p>,
    });
});

test("diffReactNode replace child", () => {
    expect(diffReactNode(<p>same</p>, <p>same</p>)).toStrictEqual(null);
    expect(diffReactNode(<p>old child</p>, <p>new child</p>)).toStrictEqual({
        type: "children",
        children: { type: "setNode", setNode: "new child" },
    });
});

test("diffReactNode simple vs array", () => {
    const list = (
        <ul>
            <li>[x] Milk</li>
            <li>[ ] Bread</li>
        </ul>
    );
    expect(diffReactNode("string", list)).toStrictEqual({
        type: "setNode",
        setNode: list,
    });
});

test("diffReactNode same array", () => {
    const list = (
        <ul>
            <li>[x] Milk</li>
            <li>[ ] Bread</li>
        </ul>
    );
    expect(diffReactNode(list, list)).toStrictEqual(null);
});

test("diffReactNode changed array element", () => {
    expect(
        diffReactNode(
            <ul>
                <li>[x] Milk</li>
                <li>[ ] Bread</li>
            </ul>,
            <ul>
                <li>[x] Milk</li>
                <li>[x] Bread</li>
            </ul>
        )
    ).toStrictEqual({
        children: {
            array: [
                null,
                {
                    children: {
                        setNode: "[x] Bread",
                        type: "setNode",
                    },
                    type: "children",
                },
            ],
            type: "array",
        },
        type: "children",
    });
});

test("diffReactNode delete array element", () => {
    expect(
        diffReactNode(
            <ul>
                <li>[x] Milk</li>
                <li>[ ] Bread</li>
                <li>[ ] Eggs</li>
            </ul>,
            <ul>
                <li>[x] Milk</li>
                <li>[ ] Bread</li>
            </ul>
        )
    ).toStrictEqual({
        children: {
            array: [null, null],
            type: "array",
        },
        type: "children",
    });
});

test("diffReactNode add array element", () => {
    expect(
        diffReactNode(
            <ul>
                <li>[x] Milk</li>
                <li>[ ] Bread</li>
            </ul>,
            <ul>
                <li>[x] Milk</li>
                <li>[ ] Bread</li>
                <li>[ ] Eggs</li>
            </ul>
        )
    ).toStrictEqual({
        children: {
            array: [
                null,
                null,
                {
                    setNode: <li>[ ] Eggs</li>,
                    type: "setNode",
                },
            ],
            type: "array",
        },
        type: "children",
    });
});

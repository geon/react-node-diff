import { expect, test } from "vitest";
import { getCategorizedReactNode } from "./categorized-react-node";
import React, { Component, type ReactNode } from "react";
import { createPortal } from "react-dom";

test("getCategorizedReactNode simple", () => {
    expect(getCategorizedReactNode("string")).toHaveProperty("type", "simple");
    expect(getCategorizedReactNode(123)).toHaveProperty("type", "simple");
    expect(getCategorizedReactNode(true)).toHaveProperty("type", "simple");
    expect(getCategorizedReactNode(null)).toHaveProperty("type", "simple");
    expect(getCategorizedReactNode(undefined)).toHaveProperty("type", "simple");
});

test("getCategorizedReactNode iterable", () => {
    expect(getCategorizedReactNode([1, 2])).toHaveProperty("type", "iterable");
});

test("getCategorizedReactNode html", () => {
    expect(getCategorizedReactNode(<div />)).toHaveProperty("type", "html");
});

test("getCategorizedReactNode function", () => {
    const Test = () => "string";
    expect(getCategorizedReactNode(<Test />)).toHaveProperty(
        "type",
        "function"
    );
});

test("getCategorizedReactNode class", () => {
    class Test extends Component {}
    expect(getCategorizedReactNode(<Test />)).toHaveProperty("type", "class");
});

test("getCategorizedReactNode portal", () => {
    const looksLikeABrowserDomNodeToReact = { nodeType: 1 };
    const PortalContent = () => "portal content";
    expect(
        getCategorizedReactNode(
            createPortal(<PortalContent />, looksLikeABrowserDomNodeToReact)
        )
    ).toHaveProperty("type", "portal");
});

test("getCategorizedReactNode fail with invalid ReactNode", () => {
    expect(() =>
        getCategorizedReactNode({
            not_a_valid_react_node: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any as ReactNode)
    ).toThrow();
});

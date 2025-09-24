import { expect, test } from "vitest";
import { evaluateReactNode } from "./evaluate-react-node";
import React, { Component, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
    expect(evaluateReactNode(anchor)).toStrictEqual(anchor);
});

test("evaluateReactNode array", () => {
    const elements = ["string", 123, true, null];
    expect(evaluateReactNode(elements)).toStrictEqual(elements);
});

test("evaluateReactNode function", () => {
    const Test = (props: { children: ReactNode }) => props.children;
    expect(
        evaluateReactNode(
            <Test>
                <Test>test</Test>
            </Test>
        )
    ).toBe("test");
});

test("evaluateReactNode fail with class component", () => {
    class Test extends Component {}
    expect(() => evaluateReactNode(<Test />)).toThrow();
});

test("evaluateReactNode children", () => {
    const TestNestedComponent = (props: { children: ReactNode }) =>
        props.children;

    expect(
        evaluateReactNode(
            <p>
                <TestNestedComponent>
                    wow - so nested - much component
                </TestNestedComponent>
            </p>
        )
    ).toStrictEqual(<p>wow - so nested - much component</p>);
});

test("evaluateReactNode exact child", () => {
    const componentContent = <p>component content</p>;
    const Component = () => componentContent;
    const component = <Component />;
    expect(evaluateReactNode(component)).toBe(componentContent);
});

test("evaluateReactNode children in portal", () => {
    const looksLikeABrowserDomNodeToReact = { nodeType: 1 };
    const PortalContent = () => "portal content";
    expect(
        evaluateReactNode(
            createPortal(<PortalContent />, looksLikeABrowserDomNodeToReact)
        )
    ).toStrictEqual(
        evaluateReactNode(
            createPortal("portal content", looksLikeABrowserDomNodeToReact)
        )
    );
});

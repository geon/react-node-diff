import { expect, test } from "vitest";
import { getCategorizedReactNode } from "./categorized-react-node";

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

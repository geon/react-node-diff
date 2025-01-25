import type { ReactHTMLElement, ReactNode } from "react";

export type CategorizedReactNode =
    | { type: "simple"; node: string | number | boolean | null | undefined }
    | { type: "iterable"; node: Iterable<ReactNode> }
    | { type: "html"; node: ReactHTMLElement<HTMLElement> };

export function getCategorizedReactNode(node: ReactNode): CategorizedReactNode {
    if (node === null || typeof node !== "object") {
        return { type: "simple", node };
    }

    if (Symbol.iterator in node) {
        return { type: "iterable", node };
    }

    if (typeof node.type === "string") {
        return { type: "html", node: node as ReactHTMLElement<HTMLElement> };
    }

    throw new Error("Unknown ReactNode category.", { cause: node });
}

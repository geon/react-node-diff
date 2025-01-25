import type { ReactElement, ReactHTMLElement, ReactNode } from "react";

type FunctionReactElement = ReactElement<
    object,
    (props: object, deprecatedLegacyContext?: unknown) => ReactNode
>;

export type CategorizedReactNode =
    | { type: "simple"; node: string | number | boolean | null | undefined }
    | { type: "iterable"; node: Iterable<ReactNode> }
    | { type: "html"; node: ReactHTMLElement<HTMLElement> }
    | { type: "function"; node: FunctionReactElement };

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

    if (typeof node.type === "function") {
        return {
            type: "function",
            node: node as FunctionReactElement,
        };
    }

    throw new Error("Unknown ReactNode category.", { cause: node });
}

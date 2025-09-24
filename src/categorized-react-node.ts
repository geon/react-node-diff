import {
    Component,
    type ReactElement,
    type ReactHTMLElement,
    type ReactNode,
    type ReactPortal,
} from "react";

type FunctionReactElement = ReactElement<
    object,
    (props: object, deprecatedLegacyContext?: unknown) => ReactNode
>;

type ClassReactElement = ReactElement<
    object,
    new (props: object, deprecatedLegacyContext?: unknown) => Component<
        object,
        unknown
    >
>;

export type CategorizedReactNode =
    | { type: "simple"; node: string | number | boolean | null | undefined }
    | { type: "iterable"; node: Iterable<ReactNode> }
    | { type: "html"; node: ReactHTMLElement<HTMLElement> }
    | { type: "function"; node: FunctionReactElement }
    | { type: "class"; node: ClassReactElement }
    | { type: "portal"; node: ReactPortal };

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
        return Object.getPrototypeOf(node.type) !== Component
            ? {
                  type: "function",
                  node: node as FunctionReactElement,
              }
            : {
                  type: "class",
                  node: node as ClassReactElement,
              };
    }

    if ("children" in node) {
        return { type: "portal", node };
    }

    throw new Error("Unknown ReactNode category.", { cause: node });
}

import type { ReactNode } from "react";

export type CategorizedReactNode =
    | { type: "simple"; node: string | number | boolean | null | undefined }
    | { type: "iterable"; node: Iterable<ReactNode> };

export function getCategorizedReactNode(node: ReactNode): CategorizedReactNode {
    if (node === null || typeof node !== "object") {
        return { type: "simple", node };
    }

    if (Symbol.iterator in node) {
        return { type: "iterable", node };
    }

    throw new Error("Unknown ReactNode category.", { cause: node });
}

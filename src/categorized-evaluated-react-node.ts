import type {
    EvaluatedHtml,
    EvaluatedReactNode,
    EvaluatedReactPortal,
} from "./evaluate-react-node";

export type CategorizedEvaluatedReactNode =
    | { type: "simple"; node: string | number | boolean | null | undefined }
    | { type: "iterable"; node: ReadonlyArray<EvaluatedReactNode> }
    | { type: "html"; node: EvaluatedHtml }
    | { type: "portal"; node: EvaluatedReactPortal };

export function getCategorizedEvaluatedReactNode(
    node: EvaluatedReactNode
): CategorizedEvaluatedReactNode {
    if (node === null || typeof node !== "object") {
        return { type: "simple", node };
    }

    if (Symbol.iterator in node) {
        return { type: "iterable", node };
    }

    if (typeof node.type === "string") {
        return { type: "html", node: node as EvaluatedHtml };
    }

    if ("children" in node) {
        return { type: "portal", node };
    }

    throw new Error("Unknown ReactNode category.", { cause: node });
}

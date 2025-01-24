import type { ReactNode } from "react";
import { evaluateReactNode } from "./evaluate-react-node";
import { getCategorizedEvaluatedReactNode } from "./categorized-evaluated-react-node";

export type ReactNodeDiff = {
    readonly type: "setNode";
    readonly setNode: ReactNode;
} | null;

export function diffReactNode(
    oldUncategorizedNode: ReactNode,
    newUncategorizedNode: ReactNode
): ReactNodeDiff {
    const newCategorized = getCategorizedEvaluatedReactNode(
        evaluateReactNode(newUncategorizedNode)
    );
    const oldCategorized = getCategorizedEvaluatedReactNode(
        evaluateReactNode(oldUncategorizedNode)
    );

    // If either node is a simple type, a shallow compare is enough.
    if (newCategorized.type === "simple" || oldCategorized.type === "simple") {
        return newCategorized.node !== oldCategorized.node
            ? { type: "setNode", setNode: newCategorized.node }
            : null;
    }

    if (newCategorized.type === "html") {
        if (oldCategorized.type !== "html") {
            return { type: "setNode", setNode: newCategorized.node };
        }
        return null;
    }

    throw new Error("Not implemented.");
}

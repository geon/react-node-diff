import { ReactNode } from "react";
import { EvaluatedReactNode } from "./evaluate-react-node";
import { getCategorizedReactNode } from "./categorized-react-node";

export type ReactNodeDiff = {
    readonly type: "setNode";
    readonly setNode: ReactNode;
} | null;

export function diffReactNode(
    oldUncategorizedNode: EvaluatedReactNode,
    newUncategorizedNode: EvaluatedReactNode
): ReactNodeDiff {
    const newCategorized = getCategorizedReactNode(newUncategorizedNode);
    const oldCategorized = getCategorizedReactNode(oldUncategorizedNode);

    // If either node is a simple type, a shallow compare is enough.
    if (newCategorized.type === "simple" || oldCategorized.type === "simple") {
        return newCategorized.node !== oldCategorized.node
            ? { type: "setNode", setNode: newCategorized.node }
            : null;
    }

    throw new Error("Not implemented.");
}

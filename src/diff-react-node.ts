import type { ReactNode } from "react";
import {
    evaluateReactNode,
    type EvaluatedReactNode,
} from "./evaluate-react-node";
import { getCategorizedEvaluatedReactNode } from "./categorized-evaluated-react-node";

export type ReactNodeDiff =
    | {
          readonly type: "setNode";
          readonly setNode: ReactNode;
      }
    | {
          readonly type: "children";
          readonly children: ReactNodeDiff;
      }
    | {
          readonly type: "array";
          readonly array: readonly ReactNodeDiff[];
      }
    | null;

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
        if (
            oldCategorized.type !== "html" ||
            newCategorized.node.type !== oldCategorized.node.type ||
            newCategorized.node.key !== oldCategorized.node.key
        ) {
            return { type: "setNode", setNode: newCategorized.node };
        }

        if ("children" in newCategorized.node.props) {
            if (!("children" in oldCategorized.node.props)) {
                return { type: "setNode", setNode: newCategorized.node };
            }
            const childrenDiff = diffReactNode(
                oldCategorized.node.props.children,
                newCategorized.node.props.children
            );
            if (childrenDiff) {
                return {
                    type: "children",
                    children: childrenDiff,
                };
            }
        }

        return null;
    }

    if (newCategorized.type === "iterable") {
        if (oldCategorized.type !== "iterable") {
            return { type: "setNode", setNode: newCategorized.node };
        }
        const arrayDiff = diffArray(oldCategorized.node, newCategorized.node);
        if (arrayDiff) {
            return {
                type: "array",
                array: arrayDiff,
            };
        }

        return null;
    }

    throw new Error("Not implemented.");
}

function diffArray(
    oldNode: readonly EvaluatedReactNode[],
    newNode: readonly EvaluatedReactNode[]
) {
    // TODO: Add reordering detection.
    const diffs = newNode.map((newSubNode, index) => {
        const oldSubNode = oldNode[index];
        return diffReactNode(oldSubNode, newSubNode);
    });

    if (diffs.every((diff) => diff === null)) {
        return undefined;
    }

    return diffs;
}

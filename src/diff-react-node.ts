import { ReactNode } from "react";
import { EvaluatedReactNode } from "./evaluate-react-node";
import { getCategorizedReactNode } from "./categorized-react-node";

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
                oldCategorized.node.props.children as EvaluatedReactNode,
                newCategorized.node.props.children as EvaluatedReactNode
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
        const arrayDiff = diffArray(
            oldCategorized.node as EvaluatedReactNode[],
            newCategorized.node as EvaluatedReactNode[]
        );
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

    if (
        oldNode.length === newNode.length &&
        diffs.every((diff) => diff === null)
    ) {
        return undefined;
    }

    return diffs;
}

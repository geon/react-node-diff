import type { ReactHTMLElement, ReactNode } from "react";
import { getCategorizedReactNode } from "./categorized-react-node";

// After it is evaluated, a html node may only contain evaluated children.
export type EvaluatedHtml = Omit<
    ReactHTMLElement<HTMLElement>,
    "ref" | "props"
> & {
    type: string;
    props: Omit<ReactHTMLElement<HTMLElement>["props"], "children"> & {
        children: EvaluatedReactNode;
    };
};

export type EvaluatedReactNode =
    | EvaluatedHtml
    | string
    | number
    | boolean
    | null
    | undefined;

export function evaluateReactNode(node: ReactNode): EvaluatedReactNode {
    const categorized = getCategorizedReactNode(node);
    switch (categorized.type) {
        case "simple": {
            return categorized.node;
        }

        case "html": {
            const categorizedChildren = getCategorizedReactNode(
                categorized.node.props.children
            );
            if (categorizedChildren.type !== "simple") {
                throw new Error("Not implemented.");
            }

            return {
                ...categorized.node,
                props: {
                    ...categorized.node.props,
                    children: categorizedChildren.node,
                },
            };
        }
    }

    throw new Error("Not implemented.");
}

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
    | ReadonlyArray<EvaluatedReactNode>
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

            return {
                ...categorized.node,
                props: {
                    ...categorized.node.props,
                    children: evaluateReactNode(categorizedChildren.node),
                },
            };
        }

        case "iterable": {
            return [...categorized.node].map(evaluateReactNode);
        }

        case "function": {
            return evaluateReactNode(
                categorized.node.type(categorized.node.props)
            );
        }

        case "class": {
            throw new Error("Class component evaluation not implemented.");
        }
    }

    throw new Error("Not implemented.");
}

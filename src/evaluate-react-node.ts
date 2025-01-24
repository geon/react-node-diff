import { ReactHTMLElement, ReactNode, ReactPortal } from "react";
import { getCategorizedReactNode } from "./categorized-react-node";

export type EvaluatedReactNode =
    | Omit<ReactHTMLElement<HTMLElement>, "ref">
    | string
    | number
    | ReadonlyArray<EvaluatedReactNode>
    | ReactPortal
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
            // Html nodes don't need further evaluation if the children are simple.
            return getCategorizedReactNode(categorized.node.props.children)
                .type === "simple"
                ? categorized.node
                : {
                      ...categorized.node,
                      props: {
                          ...categorized.node.props,
                          children: evaluateReactNode(
                              categorized.node.props.children
                          ),
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

        case "portal": {
            return {
                ...categorized.node,
                children: evaluateReactNode(categorized.node.children),
            };
        }

        default: {
            throw new Error("Unknown ReactNode.", {
                cause: categorized satisfies never,
            });
        }
    }
}

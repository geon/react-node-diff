import { ReactHTMLElement, ReactNode } from "react";
import { getCategorizedReactNode } from "./categorized-react-node";

export type EvaluatedReactNode =
    | Omit<ReactHTMLElement<HTMLElement>, "ref">
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
            return categorized.node;
        }
    }

    throw new Error("Not implemented.");
}

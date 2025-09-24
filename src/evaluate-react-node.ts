import type { ReactNode } from "react";
import { getCategorizedReactNode } from "./categorized-react-node";

export type EvaluatedReactNode = string | number | boolean | null | undefined;

export function evaluateReactNode(node: ReactNode): EvaluatedReactNode {
    const categorized = getCategorizedReactNode(node);
    switch (categorized.type) {
        case "simple": {
            return categorized.node;
        }
    }

    throw new Error("Not implemented.");
}

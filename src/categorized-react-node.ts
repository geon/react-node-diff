import { ReactNode } from "react";

export type CategorizedReactNode = {
    type: "simple";
    node: string | number | boolean | null | undefined;
};

export function getCategorizedReactNode(node: ReactNode): CategorizedReactNode {
    if (node === null || typeof node !== "object") {
        return { type: "simple", node };
    }

    console.log(node);
    throw new Error("Unknown ReactNode category.", { cause: node });
}

import React from "react";
import {Container} from "@radix-ui/themes";

export default function FilesLayout({children}: { children: React.ReactNode }) {
    return (
        <main className="drop-shadow-2xl drop-shadow-amber-50/10">
            <Container>
                {children}
            </Container>
        </main>
    );
}
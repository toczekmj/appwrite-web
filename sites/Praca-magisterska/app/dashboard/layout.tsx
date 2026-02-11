'use client'
import React from "react";
import Protected from "@/components/Auth/Protected";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <Protected>
            {children}
        </Protected>
    )
}
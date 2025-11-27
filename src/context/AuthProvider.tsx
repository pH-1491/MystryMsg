'use client'
import { SessionProvider } from "next-auth/react"
import {Session} from "node:inspector";

export default function AuthProvider({
                                children,

                            }:{ children: React.ReactNode;}) {
    return (
        <SessionProvider >
            {children}
        </SessionProvider>
    )
}
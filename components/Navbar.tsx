'use client'

import {useAuth} from "@/components/Auth/AuthContext";
import {Button, Flex, Section, Text} from "@radix-ui/themes";
import {useRouter} from "next/navigation";
import {Pages} from "@/Enums/Pages";

export function Navbar() {
    const {current, logout} = useAuth();
    const router = useRouter();

    return (

        <Section p="4" style={{backgroundColor: "var(--gray-2)"}}>
            <Flex direction="row" justify="between">
                <Text size='8'>My App</Text>

                {
                    current ? (
                        <Button size="4"
                                variant="solid"
                                onClick={logout}>
                            Logout
                        </Button>
                    ) : (
                        <Button size="4"
                                variant="solid"
                                onClick={() => router.push(Pages.login)}>
                            Login
                        </Button>
                    )
                }
            </Flex>
        </Section>


    )


}
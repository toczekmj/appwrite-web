'use client'

import AuthForm from "@/components/Auth/AuthForm";
import useLoginPage from "@/Hooks/Login/useLoginPage";
import {Box, Button, Flex, Text} from "@radix-ui/themes";

export default function LoginPage() {

    const {
        isSignUp,
        setIsSignUp,
        handleLogin,
        handleRegistration
    } = useLoginPage();

    return (
        <div className="flex flex-col text-center gap-5 w-full h-full justify-center mt-25">
            <Text size="7">
                {
                    isSignUp ? "Sign up" : "Login"
                }
            </Text>
            <Flex direction="row" justify="center">
                <AuthForm
                    handleSubmit={isSignUp ? handleRegistration : handleLogin}
                    submitType={isSignUp ? 'Sign Up' : 'Log In'}
                    isSignup={isSignUp}
                />
            </Flex>

            <Flex direction="column" justify="center">
                {
                    isSignUp ? (
                        <Box>
                            <Text size="5">Already have an account? </Text>
                            <Button size="4"
                                    variant="ghost"
                                    className="text-gray-300"
                                    onClick={() => setIsSignUp(!isSignUp)}>
                                Log in
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Text size="5">Don&#39;t have an account? </Text>
                            <Button size="4"
                                    variant="ghost"
                                    className="text-gray-300"
                                    onClick={() => setIsSignUp(!isSignUp)}>
                                Sign up
                            </Button>
                        </Box>
                    )
                }

            </Flex>
        </div>
    );
}
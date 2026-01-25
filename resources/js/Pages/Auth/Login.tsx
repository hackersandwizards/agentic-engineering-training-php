import {
    Box,
    Button,
    Center,
    Container,
    Field,
    Heading,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {
    const { errors } = usePage().props as { errors: Record<string, string> };
    const {
        register,
        handleSubmit,
        formState: { errors: formErrors, isSubmitting },
    } = useForm<LoginFormData>();

    const onSubmit = (data: LoginFormData) => {
        router.post('/login', data);
    };

    return (
        <Center minH="100vh" bg="gray.50">
            <Container maxW="md">
                <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
                    <Stack gap={6}>
                        <Box textAlign="center">
                            <Heading size="xl">Welcome back</Heading>
                            <Text color="gray.600" mt={2}>
                                Sign in to your account
                            </Text>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap={4}>
                                <Field.Root invalid={!!formErrors.email || !!errors.email}>
                                    <Field.Label>Email</Field.Label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                    />
                                    {formErrors.email && (
                                        <Field.ErrorText>{formErrors.email.message}</Field.ErrorText>
                                    )}
                                    {errors.email && (
                                        <Field.ErrorText>{errors.email}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!formErrors.password}>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...register('password', {
                                            required: 'Password is required',
                                        })}
                                    />
                                    {formErrors.password && (
                                        <Field.ErrorText>{formErrors.password.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    loading={isSubmitting}
                                    width="full"
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </form>

                        <Text textAlign="center" color="gray.600">
                            Don't have an account?{' '}
                            <Link asChild color="blue.500">
                                <InertiaLink href="/signup">Sign up</InertiaLink>
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Center>
    );
}

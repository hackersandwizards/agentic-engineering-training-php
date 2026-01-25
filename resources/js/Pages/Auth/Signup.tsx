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

interface SignupFormData {
    email: string;
    password: string;
    password_confirmation: string;
    full_name?: string;
}

export default function Signup() {
    const { errors } = usePage().props as { errors: Record<string, string> };
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors: formErrors, isSubmitting },
    } = useForm<SignupFormData>();

    const onSubmit = (data: SignupFormData) => {
        router.post('/signup', data);
    };

    return (
        <Center minH="100vh" bg="gray.50">
            <Container maxW="md">
                <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
                    <Stack gap={6}>
                        <Box textAlign="center">
                            <Heading size="xl">Create an account</Heading>
                            <Text color="gray.600" mt={2}>
                                Sign up to get started
                            </Text>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap={4}>
                                <Field.Root invalid={!!formErrors.full_name}>
                                    <Field.Label>Full Name</Field.Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your full name"
                                        {...register('full_name')}
                                    />
                                </Field.Root>

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

                                <Field.Root invalid={!!formErrors.password || !!errors.password}>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters',
                                            },
                                        })}
                                    />
                                    {formErrors.password && (
                                        <Field.ErrorText>{formErrors.password.message}</Field.ErrorText>
                                    )}
                                    {errors.password && (
                                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!formErrors.password_confirmation}>
                                    <Field.Label>Confirm Password</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm your password"
                                        {...register('password_confirmation', {
                                            required: 'Please confirm your password',
                                            validate: (value) =>
                                                value === getValues('password') || 'Passwords do not match',
                                        })}
                                    />
                                    {formErrors.password_confirmation && (
                                        <Field.ErrorText>
                                            {formErrors.password_confirmation.message}
                                        </Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    loading={isSubmitting}
                                    width="full"
                                >
                                    Sign up
                                </Button>
                            </Stack>
                        </form>

                        <Text textAlign="center" color="gray.600">
                            Already have an account?{' '}
                            <Link asChild color="blue.500">
                                <InertiaLink href="/login">Sign in</InertiaLink>
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Container>
        </Center>
    );
}

import {
    Box,
    Button,
    Dialog,
    Portal,
    Field,
    Heading,
    Input,
    Stack,
    Tabs,
    Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { DashboardLayout } from '@/Components/Layout/DashboardLayout';
import { PageProps } from '@/types';

interface UserInfoFormData {
    email: string;
    full_name: string;
}

interface PasswordFormData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export default function Settings() {
    const { auth, errors } = usePage<PageProps & { errors: Record<string, string> }>().props;
    const user = auth.user;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // User Info Form
    const userInfoForm = useForm<UserInfoFormData>({
        defaultValues: {
            email: user?.email || '',
            full_name: user?.fullName || '',
        },
    });

    const handleUpdateProfile = (data: UserInfoFormData) => {
        setIsUpdatingProfile(true);
        router.patch('/settings/profile', data, {
            preserveScroll: true,
            onFinish: () => setIsUpdatingProfile(false),
        });
    };

    // Password Form
    const passwordForm = useForm<PasswordFormData>();

    const handleChangePassword = (data: PasswordFormData) => {
        setIsChangingPassword(true);
        setPasswordSuccess(false);
        router.patch('/settings/password', {
            current_password: data.current_password,
            new_password: data.new_password,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setPasswordSuccess(true);
            },
            onFinish: () => setIsChangingPassword(false),
        });
    };

    // Delete Account
    const handleDeleteAccount = () => {
        setIsDeletingAccount(true);
        router.delete('/settings/account', {
            onFinish: () => setIsDeletingAccount(false),
        });
    };

    return (
        <DashboardLayout>
            <Box>
                <Stack gap={6}>
                    <Heading size="xl">Settings</Heading>

                    <Tabs.Root defaultValue="profile">
                        <Tabs.List>
                            <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
                            <Tabs.Trigger value="password">Password</Tabs.Trigger>
                            <Tabs.Trigger value="danger">Danger Zone</Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="profile">
                            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" mt={4}>
                                <form onSubmit={userInfoForm.handleSubmit(handleUpdateProfile)}>
                                    <Stack gap={4} maxW="md">
                                        <Field.Root invalid={!!userInfoForm.formState.errors.email}>
                                            <Field.Label>Email</Field.Label>
                                            <Input
                                                {...userInfoForm.register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: 'Invalid email address',
                                                    },
                                                })}
                                            />
                                            {userInfoForm.formState.errors.email && (
                                                <Field.ErrorText>
                                                    {userInfoForm.formState.errors.email.message}
                                                </Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>Full Name</Field.Label>
                                            <Input {...userInfoForm.register('full_name')} />
                                        </Field.Root>

                                        <Button
                                            type="submit"
                                            colorScheme="blue"
                                            alignSelf="flex-start"
                                            loading={isUpdatingProfile}
                                        >
                                            Save Changes
                                        </Button>
                                    </Stack>
                                </form>
                            </Box>
                        </Tabs.Content>

                        <Tabs.Content value="password">
                            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" mt={4}>
                                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
                                    <Stack gap={4} maxW="md">
                                        <Field.Root
                                            invalid={!!passwordForm.formState.errors.current_password || !!errors.current_password}
                                        >
                                            <Field.Label>Current Password</Field.Label>
                                            <Input
                                                type="password"
                                                {...passwordForm.register('current_password', {
                                                    required: 'Current password is required',
                                                })}
                                            />
                                            {passwordForm.formState.errors.current_password && (
                                                <Field.ErrorText>
                                                    {passwordForm.formState.errors.current_password.message}
                                                </Field.ErrorText>
                                            )}
                                            {errors.current_password && (
                                                <Field.ErrorText>
                                                    {errors.current_password}
                                                </Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        <Field.Root
                                            invalid={!!passwordForm.formState.errors.new_password}
                                        >
                                            <Field.Label>New Password</Field.Label>
                                            <Input
                                                type="password"
                                                {...passwordForm.register('new_password', {
                                                    required: 'New password is required',
                                                    minLength: {
                                                        value: 8,
                                                        message: 'Password must be at least 8 characters',
                                                    },
                                                })}
                                            />
                                            {passwordForm.formState.errors.new_password && (
                                                <Field.ErrorText>
                                                    {passwordForm.formState.errors.new_password.message}
                                                </Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        <Field.Root
                                            invalid={!!passwordForm.formState.errors.confirm_password}
                                        >
                                            <Field.Label>Confirm New Password</Field.Label>
                                            <Input
                                                type="password"
                                                {...passwordForm.register('confirm_password', {
                                                    required: 'Please confirm your password',
                                                    validate: (value) =>
                                                        value === passwordForm.getValues('new_password') ||
                                                        'Passwords do not match',
                                                })}
                                            />
                                            {passwordForm.formState.errors.confirm_password && (
                                                <Field.ErrorText>
                                                    {passwordForm.formState.errors.confirm_password.message}
                                                </Field.ErrorText>
                                            )}
                                        </Field.Root>

                                        {passwordSuccess && (
                                            <Text color="green.500" fontSize="sm">
                                                Password changed successfully!
                                            </Text>
                                        )}

                                        <Button
                                            type="submit"
                                            colorScheme="blue"
                                            alignSelf="flex-start"
                                            loading={isChangingPassword}
                                        >
                                            Change Password
                                        </Button>
                                    </Stack>
                                </form>
                            </Box>
                        </Tabs.Content>

                        <Tabs.Content value="danger">
                            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" mt={4}>
                                <Stack gap={4}>
                                    <Heading size="md" color="red.500">
                                        Delete Account
                                    </Heading>
                                    <Text color="gray.600">
                                        Once you delete your account, there is no going back. Please be
                                        certain.
                                    </Text>
                                    {user?.isSuperuser ? (
                                        <Text color="gray.500" fontSize="sm">
                                            Super users cannot delete their own account.
                                        </Text>
                                    ) : (
                                        <Button
                                            colorScheme="red"
                                            variant="outline"
                                            alignSelf="flex-start"
                                            onClick={() => setDeleteOpen(true)}
                                        >
                                            Delete My Account
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </Tabs.Content>
                    </Tabs.Root>
                </Stack>

                <Dialog.Root open={deleteOpen} onOpenChange={(e) => setDeleteOpen(e.open)}>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>Delete Account</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Text>
                                        Are you sure you want to delete your account? This action cannot
                                        be undone and all your data will be permanently removed.
                                    </Text>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant="ghost">Cancel</Button>
                                    </Dialog.ActionTrigger>
                                    <Button
                                        colorScheme="red"
                                        onClick={handleDeleteAccount}
                                        loading={isDeletingAccount}
                                    >
                                        Delete Account
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </Box>
        </DashboardLayout>
    );
}

import {
    Button,
    Checkbox,
    Dialog,
    Portal,
    Field,
    Input,
    Stack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { User } from '@/types';

interface EditUserFormData {
    email: string;
    password?: string;
    full_name?: string;
    is_superuser: boolean;
    is_active: boolean;
}

interface EditUserDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
    user,
    open,
    onOpenChange,
}: EditUserDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditUserFormData>();

    useEffect(() => {
        if (open) {
            reset({
                email: user.email,
                full_name: user.fullName || '',
                is_superuser: user.isSuperuser,
                is_active: user.isActive,
            });
        }
    }, [open, user, reset]);

    const onSubmit = (data: EditUserFormData) => {
        setIsSubmitting(true);
        const updateData: Record<string, unknown> = {
            email: data.email,
            full_name: data.full_name,
            is_superuser: data.is_superuser,
            is_active: data.is_active,
        };
        if (data.password) {
            updateData.password = data.password;
        }
        router.put(`/admin/users/${user.id}`, updateData, {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit User</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
                                <Stack gap={4}>
                                    <Field.Root invalid={!!errors.email}>
                                        <Field.Label>Email</Field.Label>
                                        <Input
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Invalid email address',
                                                },
                                            })}
                                        />
                                        {errors.email && (
                                            <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>New Password (leave blank to keep)</Field.Label>
                                        <Input
                                            type="password"
                                            {...register('password', {
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters',
                                                },
                                            })}
                                            placeholder="Enter new password"
                                        />
                                        {errors.password && (
                                            <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Full Name</Field.Label>
                                        <Input {...register('full_name')} />
                                    </Field.Root>

                                    <Checkbox.Root {...register('is_superuser')}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>Super user</Checkbox.Label>
                                    </Checkbox.Root>

                                    <Checkbox.Root {...register('is_active')}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>Active</Checkbox.Label>
                                    </Checkbox.Root>
                                </Stack>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="ghost">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                type="submit"
                                form="edit-user-form"
                                colorScheme="blue"
                                loading={isSubmitting}
                            >
                                Save
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

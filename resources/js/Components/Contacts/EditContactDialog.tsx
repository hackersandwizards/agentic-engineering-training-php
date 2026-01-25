import {
    Button,
    Dialog,
    Portal,
    Field,
    Input,
    Stack,
    Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Contact } from '@/types';

interface EditContactFormData {
    organisation: string;
    description?: string;
}

interface EditContactDialogProps {
    contact: Contact;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditContactDialog({
    contact,
    open,
    onOpenChange,
}: EditContactDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditContactFormData>();

    useEffect(() => {
        if (open) {
            reset({
                organisation: contact.organisation,
                description: contact.description || '',
            });
        }
    }, [open, contact, reset]);

    const onSubmit = (data: EditContactFormData) => {
        setIsSubmitting(true);
        router.put(`/contacts/${contact.id}`, data, {
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
                            <Dialog.Title>Edit Contact</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <form id="edit-contact-form" onSubmit={handleSubmit(onSubmit)}>
                                <Stack gap={4}>
                                    <Field.Root invalid={!!errors.organisation}>
                                        <Field.Label>Organisation</Field.Label>
                                        <Input
                                            {...register('organisation', {
                                                required: 'Organisation is required',
                                                maxLength: {
                                                    value: 255,
                                                    message: 'Organisation must be at most 255 characters',
                                                },
                                            })}
                                            placeholder="Enter organisation name"
                                        />
                                        {errors.organisation && (
                                            <Field.ErrorText>{errors.organisation.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Description</Field.Label>
                                        <Textarea
                                            {...register('description')}
                                            placeholder="Enter description (optional)"
                                        />
                                    </Field.Root>
                                </Stack>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="ghost">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                type="submit"
                                form="edit-contact-form"
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

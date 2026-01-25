import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { User } from '@/types';

interface DeleteUserDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
}: DeleteUserDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = () => {
        setIsSubmitting(true);
        router.delete(`/admin/users/${user.id}`, {
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
                            <Dialog.Title>Delete User</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                Are you sure you want to delete the user "{user.email}"?
                                This action cannot be undone and all their data will be permanently
                                removed.
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="ghost">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                loading={isSubmitting}
                            >
                                Delete
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

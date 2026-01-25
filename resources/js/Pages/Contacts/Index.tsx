import {
    Box,
    Button,
    Flex,
    Heading,
    Menu,
    Portal,
    Skeleton,
    Stack,
    Table,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { DashboardLayout } from '@/Components/Layout/DashboardLayout';
import { AddContactDialog } from '@/Components/Contacts/AddContactDialog';
import { EditContactDialog } from '@/Components/Contacts/EditContactDialog';
import { DeleteContactDialog } from '@/Components/Contacts/DeleteContactDialog';
import { Contact, PageProps, PaginatedData } from '@/types';

interface ContactsPageProps extends PageProps {
    contacts: PaginatedData<Contact>;
}

export default function ContactsIndex() {
    const { contacts } = usePage<ContactsPageProps>().props;
    const [editContact, setEditContact] = useState<Contact | null>(null);
    const [deleteContact, setDeleteContact] = useState<Contact | null>(null);

    const contactList = contacts.data || [];
    const currentPage = contacts.current_page;
    const totalPages = contacts.last_page;

    const handlePageChange = (page: number) => {
        router.get('/contacts', { page }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Box>
                <Stack gap={6}>
                    <Flex justify="space-between" align="center">
                        <Heading size="xl">Contacts</Heading>
                        <AddContactDialog />
                    </Flex>

                    <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Organisation</Table.ColumnHeader>
                                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                                    <Table.ColumnHeader width="100px">Actions</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {contactList.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={3}>
                                            <Text textAlign="center" color="gray.500" py={4}>
                                                No contacts yet. Add your first contact!
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    contactList.map((contact) => (
                                        <Table.Row key={contact.id}>
                                            <Table.Cell fontWeight="medium">
                                                {contact.organisation}
                                            </Table.Cell>
                                            <Table.Cell color="gray.600">
                                                {contact.description || '-'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Menu.Root>
                                                    <Menu.Trigger asChild>
                                                        <Button size="sm" variant="ghost">
                                                            ...
                                                        </Button>
                                                    </Menu.Trigger>
                                                    <Portal>
                                                        <Menu.Positioner>
                                                            <Menu.Content>
                                                                <Menu.Item
                                                                    value="edit"
                                                                    onClick={() => setEditContact(contact)}
                                                                >
                                                                    Edit
                                                                </Menu.Item>
                                                                <Menu.Item
                                                                    value="delete"
                                                                    color="red.500"
                                                                    onClick={() => setDeleteContact(contact)}
                                                                >
                                                                    Delete
                                                                </Menu.Item>
                                                            </Menu.Content>
                                                        </Menu.Positioner>
                                                    </Portal>
                                                </Menu.Root>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>

                        {totalPages > 1 && (
                            <Flex justify="center" p={4} gap={2}>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Text alignSelf="center" color="gray.600">
                                    Page {currentPage} of {totalPages}
                                </Text>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                </Button>
                            </Flex>
                        )}
                    </Box>
                </Stack>

                {editContact && (
                    <EditContactDialog
                        contact={editContact}
                        open={!!editContact}
                        onOpenChange={(open) => !open && setEditContact(null)}
                    />
                )}

                {deleteContact && (
                    <DeleteContactDialog
                        contact={deleteContact}
                        open={!!deleteContact}
                        onOpenChange={(open) => !open && setDeleteContact(null)}
                    />
                )}
            </Box>
        </DashboardLayout>
    );
}

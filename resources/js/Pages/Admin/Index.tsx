import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Menu,
    Portal,
    Stack,
    Table,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { DashboardLayout } from '@/Components/Layout/DashboardLayout';
import { AddUserDialog } from '@/Components/Admin/AddUserDialog';
import { EditUserDialog } from '@/Components/Admin/EditUserDialog';
import { DeleteUserDialog } from '@/Components/Admin/DeleteUserDialog';
import { PageProps, PaginatedData, User } from '@/types';

interface AdminPageProps extends PageProps {
    users: PaginatedData<User>;
}

export default function AdminIndex() {
    const { auth, users } = usePage<AdminPageProps>().props;
    const currentUser = auth.user;
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const userList = users.data || [];
    const currentPage = users.current_page;
    const totalPages = users.last_page;

    const handlePageChange = (page: number) => {
        router.get('/admin', { page }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Box>
                <Stack gap={6}>
                    <Flex justify="space-between" align="center">
                        <Heading size="xl">User Management</Heading>
                        <AddUserDialog />
                    </Flex>

                    <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Email</Table.ColumnHeader>
                                    <Table.ColumnHeader>Role</Table.ColumnHeader>
                                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                                    <Table.ColumnHeader width="100px">Actions</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {userList.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={5}>
                                            <Text textAlign="center" color="gray.500" py={4}>
                                                No users found.
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    userList.map((user) => (
                                        <Table.Row key={user.id}>
                                            <Table.Cell fontWeight="medium">
                                                <Flex align="center" gap={2}>
                                                    {user.fullName || '-'}
                                                    {user.id === currentUser?.id && (
                                                        <Badge colorScheme="blue" size="sm">
                                                            You
                                                        </Badge>
                                                    )}
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell color="gray.600">{user.email}</Table.Cell>
                                            <Table.Cell>
                                                <Badge
                                                    colorScheme={user.isSuperuser ? 'purple' : 'gray'}
                                                >
                                                    {user.isSuperuser ? 'Admin' : 'User'}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
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
                                                                    onClick={() => setEditUser(user)}
                                                                >
                                                                    Edit
                                                                </Menu.Item>
                                                                {user.id !== currentUser?.id && (
                                                                    <Menu.Item
                                                                        value="delete"
                                                                        color="red.500"
                                                                        onClick={() => setDeleteUser(user)}
                                                                    >
                                                                        Delete
                                                                    </Menu.Item>
                                                                )}
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

                {editUser && (
                    <EditUserDialog
                        user={editUser}
                        open={!!editUser}
                        onOpenChange={(open) => !open && setEditUser(null)}
                    />
                )}

                {deleteUser && (
                    <DeleteUserDialog
                        user={deleteUser}
                        open={!!deleteUser}
                        onOpenChange={(open) => !open && setDeleteUser(null)}
                    />
                )}
            </Box>
        </DashboardLayout>
    );
}

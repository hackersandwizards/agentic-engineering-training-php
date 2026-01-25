import {
    Box,
    Button,
    Flex,
    Menu,
    Portal,
    Text,
} from '@chakra-ui/react';
import { router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export function Navbar() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <Box
            as="header"
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            px={6}
            py={4}
        >
            <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    Contact Management
                </Text>

                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="ghost" size="sm">
                            {user?.fullName || user?.email || 'User'}
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item value="email" disabled>
                                    <Text fontSize="sm" color="gray.500">
                                        {user?.email}
                                    </Text>
                                </Menu.Item>
                                <Menu.Separator />
                                <Menu.Item value="logout" onClick={handleLogout}>
                                    Sign out
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
        </Box>
    );
}

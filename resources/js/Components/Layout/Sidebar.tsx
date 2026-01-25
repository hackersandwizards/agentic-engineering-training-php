import { Box, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { Link as InertiaLink, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface NavItem {
    name: string;
    path: string;
    icon: string;
    adminOnly?: boolean;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Contacts', path: '/contacts', icon: '👥' },
    { name: 'Admin', path: '/admin', icon: '⚙️', adminOnly: true },
    { name: 'Settings', path: '/settings', icon: '🔧' },
];

export function Sidebar() {
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const pathname = page.url?.split('?')[0] || '/';

    const filteredItems = navItems.filter(
        (item) => !item.adminOnly || auth.user?.isSuperuser
    );

    return (
        <Box
            as="aside"
            w="250px"
            bg="gray.800"
            color="white"
            minH="100vh"
            py={6}
            px={4}
        >
            <Text fontSize="xl" fontWeight="bold" mb={8} px={4}>
                CRM
            </Text>

            <Stack gap={2}>
                {filteredItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            asChild
                            _hover={{ textDecoration: 'none' }}
                            _focus={{ outline: 'none', boxShadow: 'none' }}
                        >
                            <InertiaLink href={item.path}>
                                <Flex
                                    align="center"
                                    px={4}
                                    py={3}
                                    borderRadius="md"
                                    bg={isActive ? 'blue.600' : 'transparent'}
                                    color="white"
                                    _hover={{ bg: isActive ? 'blue.600' : 'gray.700' }}
                                    transition="background 0.2s"
                                >
                                    <Text mr={3}>{item.icon}</Text>
                                    <Text>{item.name}</Text>
                                </Flex>
                            </InertiaLink>
                        </Link>
                    );
                })}
            </Stack>
        </Box>
    );
}

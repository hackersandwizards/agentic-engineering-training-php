import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
    return (
        <Flex minH="100vh">
            <Sidebar />
            <Box flex={1} bg="gray.50">
                <Navbar />
                <Box p={6}>{children}</Box>
            </Box>
        </Flex>
    );
}

import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import { usePage } from '@inertiajs/react';
import { DashboardLayout } from '@/Components/Layout/DashboardLayout';
import { PageProps } from '@/types';

interface DashboardPageProps extends PageProps {
    stats: {
        contactCount: number;
    };
}

export default function Dashboard() {
    const { auth, stats } = usePage<DashboardPageProps>().props;
    const user = auth.user;

    return (
        <DashboardLayout>
            <Box>
                <Stack gap={6}>
                    <Box>
                        <Heading size="xl">
                            Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!
                        </Heading>
                        <Text color="gray.600" mt={2}>
                            Manage your contacts and settings from this dashboard.
                        </Text>
                    </Box>

                    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                        <Heading size="md" mb={4}>
                            Quick Stats
                        </Heading>
                        <Text color="gray.600">
                            You have {stats.contactCount} contact{stats.contactCount !== 1 ? 's' : ''}.
                        </Text>
                        <Text color="gray.600" mt={2}>
                            Use the sidebar to navigate to different sections of the application.
                        </Text>
                    </Box>
                </Stack>
            </Box>
        </DashboardLayout>
    );
}

<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create superuser
        $superuser = User::firstOrCreate(
            ['email' => env('FIRST_SUPERUSER_EMAIL', 'dev@example.com')],
            [
                'password' => env('FIRST_SUPERUSER_PASSWORD', 'DevPassword'),
                'full_name' => 'Dev Admin',
                'is_active' => true,
                'is_superuser' => true,
            ]
        );

        // Create Alice
        $alice = User::firstOrCreate(
            ['email' => 'alice@example.com'],
            [
                'password' => 'AlicePassword123',
                'full_name' => 'Alice Johnson',
                'is_active' => true,
                'is_superuser' => false,
            ]
        );

        // Create Bob
        $bob = User::firstOrCreate(
            ['email' => 'bob@example.com'],
            [
                'password' => 'BobPassword123',
                'full_name' => 'Bob Smith',
                'is_active' => true,
                'is_superuser' => false,
            ]
        );

        // Superuser contacts
        $superuserContacts = [
            ['organisation' => 'OpenAI', 'description' => 'AI research company'],
            ['organisation' => 'Anthropic', 'description' => 'AI safety company'],
            ['organisation' => 'Google DeepMind', 'description' => 'AI research lab'],
            ['organisation' => 'Meta AI', 'description' => 'AI research division'],
            ['organisation' => 'Microsoft Research', 'description' => 'Technology research'],
        ];

        foreach ($superuserContacts as $contact) {
            Contact::firstOrCreate(
                ['organisation' => $contact['organisation'], 'owner_id' => $superuser->id],
                ['description' => $contact['description']]
            );
        }

        // Alice contacts
        $aliceContacts = [
            ['organisation' => 'Acme Corp', 'description' => 'Manufacturing company'],
            ['organisation' => 'TechStart Inc', 'description' => 'Startup accelerator'],
        ];

        foreach ($aliceContacts as $contact) {
            Contact::firstOrCreate(
                ['organisation' => $contact['organisation'], 'owner_id' => $alice->id],
                ['description' => $contact['description']]
            );
        }

        // Bob contacts
        $bobContacts = [
            ['organisation' => 'DataFlow Systems', 'description' => 'Data analytics'],
            ['organisation' => 'CloudNine Hosting', 'description' => 'Cloud infrastructure'],
            ['organisation' => 'SecureNet', 'description' => 'Cybersecurity services'],
        ];

        foreach ($bobContacts as $contact) {
            Contact::firstOrCreate(
                ['organisation' => $contact['organisation'], 'owner_id' => $bob->id],
                ['description' => $contact['description']]
            );
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Superuser: ' . env('FIRST_SUPERUSER_EMAIL', 'dev@example.com'));
    }
}

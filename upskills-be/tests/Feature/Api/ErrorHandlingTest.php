<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ErrorHandlingTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_returns_404_for_nonexistent_resource(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/courses/nonexistent-course');

        $response->assertStatus(404);
    }

    public function test_api_returns_422_for_validation_errors(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_api_returns_403_for_forbidden_actions(): void
    {
        $user = User::factory()->create();
        // User without student role
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/courses');

        $response->assertStatus(403);
    }

    public function test_api_handles_missing_required_fields(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }
}


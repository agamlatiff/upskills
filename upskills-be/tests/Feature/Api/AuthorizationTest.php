<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_access_student_routes(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/courses');

        $response->assertStatus(200);
    }

    public function test_user_without_student_role_cannot_access_student_routes(): void
    {
        $user = User::factory()->create();
        // User has no role assigned
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/courses');

        $response->assertStatus(403);
    }

    public function test_user_without_active_subscription_cannot_access_learning_routes(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/learning/test-course/1/1');

        $response->assertStatus(403)
            ->assertJson([
                'error' => 'subscription_required',
            ]);
    }

    public function test_authenticated_user_can_access_profile(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
            ]);
    }
}


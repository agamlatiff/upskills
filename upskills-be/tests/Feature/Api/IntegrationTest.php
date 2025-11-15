<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\Pricing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class IntegrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test complete user flow: Registration → Login → Dashboard
     */
    public function test_complete_registration_login_dashboard_flow(): void
    {
        // Step 1: Register
        $registerResponse = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'occupation' => 'Developer',
            'photo' => $this->createTestImage(),
        ]);

        $registerResponse->assertStatus(201);
        $token = $registerResponse->json('token');
        $userId = $registerResponse->json('user.id');

        // Step 2: Login with registered credentials
        $loginResponse = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200);
        $this->assertNotEmpty($loginResponse->json('token'));

        // Step 3: Access Dashboard (requires student role)
        $user = User::find($userId);
        $user->assignRole('student');
        
        Sanctum::actingAs($user);

        $dashboardResponse = $this->getJson('/api/dashboard/courses');
        $dashboardResponse->assertStatus(200);
    }

    /**
     * Test complete flow: Course browsing → Checkout → Payment
     */
    public function test_course_browsing_checkout_payment_flow(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        $pricing = Pricing::factory()->create([
            'price' => 100000,
            'duration' => 30,
        ]);

        Sanctum::actingAs($user);

        // Step 1: Browse pricing
        $pricingResponse = $this->getJson('/api/pricing');
        $pricingResponse->assertStatus(200);
        $this->assertNotEmpty($pricingResponse->json());

        // Step 2: Get checkout data
        $checkoutResponse = $this->getJson("/api/checkout/{$pricing->id}");
        $checkoutResponse->assertStatus(200);
        $this->assertArrayHasKey('grand_total_amount', $checkoutResponse->json());

        // Step 3: Process payment (mock)
        $paymentResponse = $this->postJson('/api/payment/midtrans', [
            'pricing_id' => $pricing->id,
        ]);

        $paymentResponse->assertStatus(200);
    }

    /**
     * Test course learning flow
     */
    public function test_course_learning_flow(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        // Create active subscription
        Transaction::factory()->create([
            'user_id' => $user->id,
            'is_paid' => true,
            'ended_at' => now()->addDays(30),
        ]);

        $course = Course::factory()->create(['slug' => 'test-course']);
        
        Sanctum::actingAs($user);

        // Step 1: Join course
        $joinResponse = $this->postJson("/api/dashboard/join/{$course->slug}");
        $joinResponse->assertStatus(200);

        // Step 2: Access learning content (requires course sections/content)
        // Note: This test assumes course has sections and content
        // In real scenario, you'd create course sections and content first
    }

    /**
     * Test profile update flow
     */
    public function test_profile_update_flow(): void
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);
        $user->assignRole('student');
        
        Sanctum::actingAs($user);

        // Step 1: Get profile
        $profileResponse = $this->getJson('/api/profile');
        $profileResponse->assertStatus(200);
        $this->assertEquals('Original Name', $profileResponse->json('name'));

        // Step 2: Update profile
        $updateResponse = $this->patchJson('/api/profile', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $updateResponse->assertStatus(200);
        $this->assertEquals('Updated Name', $updateResponse->json('user.name'));

        // Step 3: Verify update
        $updatedProfileResponse = $this->getJson('/api/profile');
        $updatedProfileResponse->assertStatus(200);
        $this->assertEquals('Updated Name', $updatedProfileResponse->json('name'));
    }

    private function createTestImage()
    {
        return \Illuminate\Http\UploadedFile::fake()->image('test.jpg', 100, 100);
    }
}


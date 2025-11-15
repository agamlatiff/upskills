<?php

namespace Tests\Feature\Api;

use App\Models\Pricing;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_checkout(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        $pricing = Pricing::factory()->create();
        
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/checkout/{$pricing->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'pricing' => [
                    'id',
                    'name',
                    'price',
                ],
                'sub_total_amount',
                'total_tax_amount',
                'grand_total_amount',
            ]);
    }

    public function test_user_cannot_checkout_without_student_role(): void
    {
        $user = User::factory()->create();
        $pricing = Pricing::factory()->create();
        
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/checkout/{$pricing->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_view_subscriptions(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        Transaction::factory()->create([
            'user_id' => $user->id,
            'is_paid' => true,
        ]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/subscriptions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'booking_trx_id',
                    'is_paid',
                    'pricing',
                ],
            ]);
    }

    public function test_user_can_view_subscription_details(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        
        $transaction = Transaction::factory()->create([
            'user_id' => $user->id,
            'is_paid' => true,
        ]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/dashboard/subscription/{$transaction->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'booking_trx_id',
                'grand_total_amount',
                'is_paid',
                'pricing',
            ]);
    }
}


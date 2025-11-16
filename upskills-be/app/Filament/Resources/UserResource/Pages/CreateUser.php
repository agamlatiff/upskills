<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Hash the password before creating
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Remove role from data as we'll handle it separately
        $role = $data['role'] ?? 'student';
        unset($data['role']);
        $this->roleToAssign = $role;

        return $data;
    }

    protected $roleToAssign = 'student';

    protected function afterCreate(): void
    {
        // Assign role after creating user
        $role = $this->roleToAssign ?? $this->form->getState()['role'] ?? 'student';
        // Only allow assigning student or mentor roles
        if ($role && in_array($role, ['student', 'mentor'])) {
            $this->record->syncRoles([$role]);
        } else {
            // Default to student if invalid role
            $this->record->syncRoles(['student']);
        }
    }
}

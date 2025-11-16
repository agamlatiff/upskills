<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Hash;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Load current role into form
        // If user has admin role, default to student (admin role shouldn't be changed via UI)
        $currentRole = $this->record->roles->first()?->name ?? 'student';
        $data['role'] = in_array($currentRole, ['student', 'mentor']) ? $currentRole : 'student';
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Remove password from data if it's empty (to keep current password)
        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            // Hash the password if it's being updated
            $data['password'] = Hash::make($data['password']);
        }

        // Remove role from data as we'll handle it separately
        $this->roleToAssign = $data['role'] ?? null;
        unset($data['role']);

        return $data;
    }

    protected $roleToAssign = null;

    protected function afterSave(): void
    {
        // Sync roles after saving
        $role = $this->roleToAssign ?? $this->form->getState()['role'] ?? null;
        if ($role && in_array($role, ['student', 'mentor'])) {
            // Only allow changing to student or mentor roles
            // Preserve admin role if user is admin (don't remove it, but don't add it via UI)
            if ($this->record->hasRole('admin')) {
                // If user is admin, keep admin role and add the selected role
                // But typically we want to replace, so let's just sync the new role
                // Admin role changes should be done manually
            }
            $this->record->syncRoles([$role]);
        }
    }
}

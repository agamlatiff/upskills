<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = "Customers";

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make("name")->maxLength(255)->required(),
                TextInput::make("email")->maxLength(255)->email()->required(),
                TextInput::make("password")
                    ->password()
                    ->minLength(9)
                    ->maxLength(255)
                    ->helperText("Minimum 9 characters. Leave blank to keep current password.")
                    ->required(fn($livewire) => $livewire instanceof \Filament\Resources\Pages\CreateRecord)
                    ->dehydrated(fn($livewire) => $livewire instanceof \Filament\Resources\Pages\CreateRecord || filled($livewire->data['password'] ?? null))
                    ->dehydrateStateUsing(fn($state) => filled($state) ? \Hash::make($state) : null),
                Select::make("occupation")->options([
                    "Developer" => "Developer",
                    "Designer" => "Designer",
                    "Marketer" => "Marketer",
                    "Cyber Security" => "Cyber Security",
                    "Project Manager" => "Project Manager"
                ])->required(),
                Select::make("role")
                    ->label("Role")
                    ->options(function () {
                        // Only allow admins to assign student or mentor roles through UI
                        // Admin role should be assigned manually or through other means
                        return \Spatie\Permission\Models\Role::whereIn('name', ['student', 'mentor'])
                            ->pluck('name', 'name')
                            ->mapWithKeys(function ($name) {
                            return [$name => ucfirst($name)];
                        });
                    })
                    ->searchable()
                    ->required()
                    ->helperText("Select a role: Student or Mentor")
                    ->default('student')
                    ->dehydrated(false), // Don't save directly, handle in page
                FileUpload::make("photo")
                    ->image()
                    ->required(fn($livewire) => $livewire instanceof \Filament\Resources\Pages\CreateRecord)
                    ->directory('photos')
                    ->visibility('public'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make("photo")
                    ->circular()
                    ->size(50),
                TextColumn::make("name")
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make("email")
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->copyMessage('Email copied!'),
                TextColumn::make("occupation")
                    ->badge()
                    ->color('info')
                    ->searchable(),
                TextColumn::make("roles.name")
                    ->label("Role")
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'admin' => 'danger',
                        'mentor' => 'warning',
                        'student' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => ucfirst($state))
                    ->searchable()
                    ->sortable(),
                TextColumn::make("created_at")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('roles')
                    ->relationship('roles', 'name')
                    ->label('Role')
                    ->preload()
                    ->multiple(),
                // Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\Action::make('change_role')
                    ->label('Change Role')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->form([
                        Select::make('role')
                            ->label('New Role')
                            ->options([
                                'student' => 'Student',
                                'mentor' => 'Mentor',
                            ])
                            ->required()
                            ->default(fn($record) => $record->roles->first()?->name ?? 'student'),
                    ])
                    ->action(function ($record, array $data) {
                        $role = $data['role'];
                        // Only allow changing to student or mentor roles
                        if (in_array($role, ['student', 'mentor'])) {
                            $record->syncRoles([$role]);
                            \Filament\Notifications\Notification::make()
                                ->title('Role changed successfully')
                                ->success()
                                ->send();
                        }
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Change User Role')
                    ->modalDescription(fn($record) => "Change role for {$record->name}?")
                    ->modalSubmitActionLabel('Change Role'),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('change_role')
                        ->label('Change Role')
                        ->icon('heroicon-o-user-circle')
                        ->form([
                            Select::make('role')
                                ->label('New Role')
                                ->options([
                                    'student' => 'Student',
                                    'mentor' => 'Mentor',
                                ])
                                ->required()
                                ->default('student'),
                        ])
                        ->action(function ($records, array $data) {
                            $role = $data['role'];
                            foreach ($records as $record) {
                                // Only allow changing to student or mentor roles
                                if (in_array($role, ['student', 'mentor'])) {
                                    $record->syncRoles([$role]);
                                }
                            }
                        })
                        ->deselectRecordsAfterCompletion()
                        ->requiresConfirmation()
                        ->modalHeading('Change User Roles')
                        ->modalDescription('Are you sure you want to change the role of the selected users?')
                        ->modalSubmitActionLabel('Change Role'),
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}

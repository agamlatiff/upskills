<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Filament\Resources\TestimonialResource\RelationManagers;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    
    protected static ?string $navigationGroup = 'Products';
    
    protected static ?string $navigationLabel = 'Testimonials';
    
    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->label('User'),
                Forms\Components\Select::make('course_id')
                    ->relationship('course', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->label('Course'),
                Forms\Components\Textarea::make('quote')
                    ->required()
                    ->rows(5)
                    ->maxLength(1000)
                    ->columnSpanFull()
                    ->label('Testimonial Quote')
                    ->helperText('The testimonial text (max 1000 characters)'),
                Forms\Components\TextInput::make('outcome')
                    ->maxLength(255)
                    ->label('Outcome')
                    ->helperText('e.g., "Got hired at Google", "Freelance $5k/mo"')
                    ->placeholder('Optional outcome or achievement'),
                Forms\Components\Toggle::make('is_verified')
                    ->label('Verified')
                    ->helperText('Only verified testimonials appear on course pages')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('user.occupation')
                    ->label('Occupation')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('course.name')
                    ->label('Course')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('quote')
                    ->label('Quote')
                    ->limit(50)
                    ->wrap()
                    ->searchable()
                    ->tooltip(fn ($record) => $record->quote),
                Tables\Columns\TextColumn::make('outcome')
                    ->label('Outcome')
                    ->searchable()
                    ->toggleable()
                    ->limit(30),
                Tables\Columns\IconColumn::make('is_verified')
                    ->label('Verified')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Verification Status')
                    ->placeholder('All testimonials')
                    ->trueLabel('Verified only')
                    ->falseLabel('Unverified only'),
                Tables\Filters\SelectFilter::make('course_id')
                    ->relationship('course', 'name')
                    ->label('Course')
                    ->searchable()
                    ->preload(),
            ])
            ->actions([
                Tables\Actions\Action::make('verify')
                    ->label('Verify')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(function (Testimonial $record) {
                        $record->is_verified = true;
                        $record->save();
                        
                        Notification::make()
                            ->title('Testimonial Verified')
                            ->success()
                            ->body('The testimonial has been verified and will now appear on course pages.')
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->visible(fn (Testimonial $record) => !$record->is_verified),
                Tables\Actions\Action::make('unverify')
                    ->label('Unverify')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(function (Testimonial $record) {
                        $record->is_verified = false;
                        $record->save();
                        
                        Notification::make()
                            ->title('Testimonial Unverified')
                            ->warning()
                            ->body('The testimonial has been unverified and will no longer appear on course pages.')
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->visible(fn (Testimonial $record) => $record->is_verified),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('verify')
                        ->label('Verify Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->action(function ($records) {
                            $records->each(function ($record) {
                                $record->is_verified = true;
                                $record->save();
                            });
                            
                            Notification::make()
                                ->title('Testimonials Verified')
                                ->success()
                                ->body(count($records) . ' testimonial(s) have been verified.')
                                ->send();
                        })
                        ->requiresConfirmation(),
                    Tables\Actions\BulkAction::make('unverify')
                        ->label('Unverify Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->action(function ($records) {
                            $records->each(function ($record) {
                                $record->is_verified = false;
                                $record->save();
                            });
                            
                            Notification::make()
                                ->title('Testimonials Unverified')
                                ->warning()
                                ->body(count($records) . ' testimonial(s) have been unverified.')
                                ->send();
                        })
                        ->requiresConfirmation(),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}

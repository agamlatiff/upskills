<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CourseResource\Pages;
use App\Filament\Resources\CourseResource\RelationManagers;
use App\Filament\Resources\CourseResource\RelationManagers\CourseSectionsRelationManager;
use App\Models\Course;
use Filament\Forms;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

use function Laravel\Prompts\textarea;

class CourseResource extends Resource
{
    protected static ?string $model = Course::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = "Products";

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Fieldset::make("Details")->schema([
                    TextInput::make("name")->maxLength(255)->required(),
                    FileUpload::make("thumbnail")->image()->required(),
                ]),

                Fieldset::make("Additional")->schema([
                    Repeater::make("benefits")->relationship("benefits")->schema([
                        TextInput::make("name")->required()
                    ]),
                    Textarea::make("about")->required(),
                    Select::make("is_populer")->options([
                        true => "Populer",
                        false => "Not Populer"
                    ])->required(),
                    Select::make("difficulty")->options([
                        "beginner" => "Beginner",
                        "intermediate" => "Intermediate",
                        "advanced" => "Advanced"
                    ])->default("beginner")->required(),
                    Select::make("is_free")->options([
                        true => "Free",
                        false => "Paid"
                    ])->default(false)->required(),
                    Select::make("category_id")->relationship("category", "name")->searchable()->preload()->required()
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make("thumbnail"),
                TextColumn::make("name"),
                TextColumn::make("category.name"),
                TextColumn::make("difficulty")
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'beginner' => 'success',
                        'intermediate' => 'warning',
                        'advanced' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),
                IconColumn::make("is_free")
                    ->boolean()
                    ->trueColor("success")
                    ->falseColor("gray")
                    ->trueIcon("heroicon-o-check-circle")
                    ->falseIcon("heroicon-o-x-circle")
                    ->label("Free"),
                IconColumn::make("is_populer")->boolean()->trueColor("success")->falseColor("danger")->trueIcon("heroicon-o-check-circle")->falseIcon("heroicon-o-x-circle")->label("Popular")
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            CourseSectionsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCourses::route('/'),
            'create' => Pages\CreateCourse::route('/create'),
            'edit' => Pages\EditCourse::route('/{record}/edit'),
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

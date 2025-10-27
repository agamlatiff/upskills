<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionResource\Pages;
use App\Filament\Resources\TransactionResource\RelationManagers;
use App\Models\Pricing;
use App\Models\Transaction;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Components\Wizard\Step;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Wizard::make([
                    Step::make("Products and Price")->schema([
                        Grid::make(2)->schema([
                            Select::make("pricing_id")
                                ->relationship("pricing", "name")->searchable()
                                ->preload()
                                ->required()
                                ->live()
                                ->afterStateUpdated(function ($state, callable $set) {
                                    $pricing = Pricing::Find($state);

                                    $price = $pricing->price;
                                    $duration = $pricing->duration;

                                    $subTotal = $price * $state;
                                    $totalPpn = $subTotal * 0.11;
                                    $totalAmount = $subTotal + $totalPpn;

                                    $set("total_tax_amount", $totalPpn);
                                    $set("grand_total_amount", $totalAmount);
                                    $set("sub_total_amount", $price);
                                    $set("duration", $duration);
                                })->afterStateHydrated(function (callable $set, $state) {
                                    $pricingId = $state;
                                    if ($pricingId) {
                                        $pricing = Pricing::find($pricingId);
                                        $duration = $pricing->duration;
                                        $set("duration", $duration);
                                    };
                                }),
                            TextInput::make("duration")->required()->numeric()->readOnly()->prefix("Months")
                        ]),
                        Grid::make(3)
                            ->schema([
                                TextInput::make("sub_total_amount")
                                    ->required()
                                    ->numeric()
                                    ->prefix("IDR")
                                    ->readOnly(),
                                TextInput::make("total_tax_amount")
                                    ->required()
                                    ->numeric()
                                    ->prefix("IDR")
                                    ->readOnly(),
                                TextInput::make("grand_total_amount")
                                    ->required()
                                    ->numeric()
                                    ->prefix("IDR")
                                    ->readOnly()
                                    ->helperText("Price have been include PPN 115")
                            ]),
                        Grid::make(2)
                            ->schema([
                                DatePicker::make("started_at")
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                        $duration = $get("duration");
                                        if ($state && $duration) {
                                            $endedAt = Carbon::parse($state)->addMonth($duration);
                                            $set("ended_at", $endedAt->format("Y-m-d"));
                                        }
                                    })->required(),

                                DatePicker::make("ended_at")
                                    ->readOnly()
                                    ->required()
                            ])

                    ]),
                ])->columnSpan("full")->columns()->skippable()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTransactions::route('/'),
            'create' => Pages\CreateTransaction::route('/create'),
            'edit' => Pages\EditTransaction::route('/{record}/edit'),
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

<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(protected TransactionService $transactionService)
    {
    }

    public function subscriptions(Request $request)
    {
        $transactions = $this->transactionService->getUserTransactions();
        return TransactionResource::collection($transactions->load('pricing', 'student'));
    }

    
    public function subscription_details(Request $request, Transaction $transaction) {
        $transaction->load('pricing', 'student');
        return new TransactionResource($transaction);
    }
}

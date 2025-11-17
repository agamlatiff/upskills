<?php

namespace App\Observers;

use App\Helpers\TransactionHelper;
use App\Models\Transaction;

class TransactionObserver
{
    
    public function creating($transaction) {
        // Hanya set booking_trx_id jika belum di-set (untuk Midtrans payment yang sudah punya order_id)
        if (empty($transaction->booking_trx_id)) {
            $transaction->booking_trx_id = TransactionHelper::generateUniqueTrxId();
        }
    }
    
    public function created(Transaction $transaction) : void {
        
    }
    
    public function updated(Transaction $transaction) : void {
        
    }
    
    public function deleted(Transaction $transaction) : void {
        
    }
    
    public function restored(Transaction $transaction) : void {
        
    }
}

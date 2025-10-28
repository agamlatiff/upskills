<?php

namespace App\Repositories;

use App\Models\Pricing;

class PricingRepository implements PricingRepositoryInterface {
  public function findById(int $id): ?Pricing {
    return Pricing::find($id);
  }
  
  public function getAll(): Collection {
    return Pricing::all();
  }
}
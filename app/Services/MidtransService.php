<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

class MidtransService
{
  public function __construct()
  {
    Config::$serverKey = config("midtrans.serverKey");
    Config::$isProduction = config("midtrans.isProduction");
    Config::$isSanitized = config("midtrans.isSanitized");
    Config::$is3ds = config("midtrans.is3ds");
  }

  public function createSnapToken(array $params): string
  {
    try {
      return Snap::getSnapToken($params);
    } catch (Exception $error) {
      Log::error("Failed to create Snap token: " . $error->getMessage());
      throw $error;
    }
  }
  
  publIC function handleNotification(): array {
    try {
      $notification = new Notification();
      return [
        "order_id" => $notification->order_id,
        "transaction_status" => $notification->transaction_status,
        "gross_amount" => $notification->gross_amount,
        "custom_field1" => $notification->custom_field1,
        "custom_field2" => $notification->custom_field2,
      ];
    } catch (Exception $error) {
      Log::error("Midtrans notifcation error: " . $error->getMessage());
      throw $error;
    }
  }
}
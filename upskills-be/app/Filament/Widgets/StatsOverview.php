<?php

namespace App\Filament\Widgets;

use App\Models\Course;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Testimonial;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalCourses = Course::count();
        $totalUsers = User::count();
        $totalTransactions = Transaction::where('is_paid', true)->count();
        $totalRevenue = Transaction::where('is_paid', true)->sum('grand_total_amount');
        $totalTestimonials = Testimonial::where('is_verified', true)->count();
        $popularCourses = Course::where('is_populer', true)->count();
        
        $recentCourses = Course::where('created_at', '>=', now()->subDays(7))->count();
        $recentUsers = User::where('created_at', '>=', now()->subDays(7))->count();
        
        return [
            Stat::make('Total Courses', $totalCourses)
                ->description($recentCourses . ' new this week')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([7, 3, 4, 5, 6, 3, 5]),
            
            Stat::make('Total Users', $totalUsers)
                ->description($recentUsers . ' new this week')
                ->descriptionIcon('heroicon-m-users')
                ->color('info')
                ->chart([3, 5, 4, 6, 7, 5, 8]),
            
            Stat::make('Total Revenue', 'Rp ' . number_format($totalRevenue, 0, ',', '.'))
                ->description($totalTransactions . ' paid transactions')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success')
                ->chart([5, 7, 6, 8, 9, 7, 10]),
            
            Stat::make('Verified Testimonials', $totalTestimonials)
                ->description($popularCourses . ' popular courses')
                ->descriptionIcon('heroicon-m-star')
                ->color('warning')
                ->chart([4, 5, 6, 5, 7, 6, 8]),
        ];
    }
}



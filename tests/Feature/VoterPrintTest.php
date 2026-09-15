<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Tests\TestCase;

class VoterPrintTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        ElectionSetting::firstOrCreate([], [
            'school_name' => 'SMA TAMANSISWA MOJOKERTO',
            'academic_year' => '2025/2026',
            'title' => 'Pemilihan Ketua PPTS',
            'is_voting_active' => true,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_voter_print(): void
    {
        $response = $this->get('/admin/voters/print-cards');
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_can_access_voter_print_cards_page(): void
    {
        $admin = Admin::where('username', 'admin')->first();
        if (!$admin) {
            $admin = Admin::create([
                'name' => 'Admin Test',
                'username' => 'admin',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            ]);
        }

        $response = $this->actingAs($admin, 'admin')
            ->get('/admin/voters/print-cards');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Voters/PrintCards')
                ->has('voters')
                ->has('setting')
        );
    }

    public function test_admin_can_filter_print_cards_by_class_or_ids(): void
    {
        $admin = Admin::where('username', 'admin')->first();

        $voter = Voter::first();

        if ($voter) {
            $response = $this->actingAs($admin, 'admin')
                ->get('/admin/voters/print-cards?ids=' . $voter->id);

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => 
                $page->component('Admin/Voters/PrintCards')
                    ->where('voters.0.id', $voter->id)
            );
        }
    }
}

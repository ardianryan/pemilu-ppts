<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VotingFlowTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure ElectionSetting exists
        ElectionSetting::firstOrCreate([], [
            'school_name' => 'SMA/SMK TAMANSISWA',
            'academic_year' => '2025/2026',
            'title' => 'Pemilihan Ketua & Wakil Ketua PPTS',
            'is_voting_active' => true,
        ]);
    }

    public function test_login_page_is_accessible(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_voter_can_login_with_valid_nisn_and_token(): void
    {
        $voter = Voter::where('nisn', '0061234501')->first();
        $this->assertNotNull($voter);

        $response = $this->post('/login', [
            'nisn' => '0061234501',
            'token' => $voter->token,
        ]);

        $response->assertRedirect('/voting');
        $this->assertAuthenticatedAs($voter, 'voter');
    }

    public function test_voter_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->post('/login', [
            'nisn' => '0061234501',
            'token' => 'INVALID_TOKEN', // wrong Token
        ]);

        $response->assertSessionHasErrors(['nisn']);
    }

    public function test_unauthenticated_voter_cannot_access_voting_booth(): void
    {
        $response = $this->get('/voting');
        $response->assertRedirect('/login');
    }

    public function test_voter_can_cast_vote_and_is_logged_out_automatically(): void
    {
        $voter = Voter::where('nisn', '0061234502')->first();
        $this->assertNotNull($voter);
        $voter->update(['has_voted' => false, 'voted_at' => null, 'receipt_token' => null]);
        $this->assertFalse($voter->fresh()->has_voted);

        $candidate = Candidate::where('candidate_number', 1)->first();
        $initialVotes = $candidate->vote_count;

        $response = $this->actingAs($voter, 'voter')
            ->post('/voting/store', [
                'candidate_id' => $candidate->id,
            ]);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Voting/Receipt')->has('receipt'));

        // Check that candidate vote count incremented
        $this->assertEquals($initialVotes + 1, $candidate->fresh()->vote_count);

        // Check that voter status updated
        $updatedVoter = $voter->fresh();
        $this->assertTrue($updatedVoter->has_voted);
        $this->assertNotNull($updatedVoter->voted_at);
        $this->assertNotNull($updatedVoter->receipt_token);

        // Check that session is logged out
        $this->assertGuest('voter');
    }

    public function test_voter_who_has_voted_cannot_login_again(): void
    {
        $voter = Voter::where('nisn', '0061234502')->first();
        $this->assertTrue($voter->has_voted);

        $response = $this->post('/login', [
            'nisn' => '0061234502',
            'token' => $voter->token,
        ]);

        $response->assertSessionHasErrors(['nisn']);
    }

    public function test_admin_can_login_and_access_dashboard(): void
    {
        $response = $this->post('/admin/login', [
            'login' => 'admin',
            'password' => 'admin123',
        ]);

        $response->assertRedirect('/admin/dashboard');

        $admin = Admin::where('username', 'admin')->first();
        $this->assertAuthenticatedAs($admin, 'admin');

        $dashboardResponse = $this->actingAs($admin, 'admin')->get('/admin/dashboard');
        $dashboardResponse->assertStatus(200);
    }

    public function test_admin_can_update_password(): void
    {
        $admin = Admin::where('username', 'admin')->first();

        $response = $this->actingAs($admin, 'admin')->post('/admin/settings/password', [
            'current_password' => 'admin123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHas('success');
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('newpassword123', $admin->fresh()->password));

        // Restore password to admin123
        $admin->update(['password' => \Illuminate\Support\Facades\Hash::make('admin123')]);
    }
}

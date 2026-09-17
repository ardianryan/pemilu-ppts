<?php

namespace Tests\Feature;

use Tests\TestCase;

class CustomErrorPageTest extends TestCase
{
    public function test_404_error_page_status_code(): void
    {
        $response = $this->get('/non-existent-page-url-12345');
        $response->assertStatus(404);
    }

    public function test_rate_limiter_throttles_excessive_login_attempts(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $this->post('/login', ['token' => 'INVALID_TOKEN']);
        }

        $response = $this->post('/login', ['token' => 'INVALID_TOKEN']);
        $response->assertStatus(429);
    }

    public function test_demo_antrean_route_renders_429_page(): void
    {
        $response = $this->get('/demo-antrean');
        $response->assertStatus(429);
    }
}

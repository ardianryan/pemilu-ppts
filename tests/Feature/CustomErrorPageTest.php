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
}

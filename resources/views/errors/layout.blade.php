<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>@yield('title') - PEMILU PPTS SMA TAMANSISWA MOJOKERTO</title>
    <link rel="icon" type="image/png" href="/images/logo2.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        *, ::before, ::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #F4F7F4;
            color: #101F15;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            -webkit-font-smoothing: antialiased;
        }
        .header {
            position: sticky;
            top: 0;
            z-index: 30;
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-bottom: 1px solid #E1F2E2;
            padding: 14px 24px;
        }
        .header-container {
            max-width: 1024px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }
        .branding {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: inherit;
        }
        .branding img {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }
        .branding-title {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 800;
            font-size: 16px;
            color: #204E2B;
            letter-spacing: -0.02em;
            line-height: 1.2;
            display: block;
        }
        .branding-subtitle {
            font-size: 11px;
            font-weight: 600;
            color: #727970;
            display: block;
        }
        .header-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #2D6A4F;
            background-color: #E6F8E8;
            padding: 6px 12px;
            border-radius: 12px;
            border: 1px solid #C2E9C6;
        }
        .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 16px;
        }
        .error-card {
            max-width: 480px;
            width: 100%;
            background-color: #FFFFFF;
            border: 1px solid #E1F2E2;
            border-radius: 24px;
            padding: 36px 28px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(56, 102, 65, 0.06);
        }
        .icon-container {
            width: 76px;
            height: 76px;
            border-radius: 20px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-green {
            background-color: #E6F8E8;
            color: #386641;
        }
        .icon-red {
            background-color: #FFDAD6;
            color: #BA1A1A;
        }
        .icon-yellow {
            background-color: #FEF3C7;
            color: #D97706;
        }
        .badge {
            display: inline-block;
            font-family: monospace;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 9999px;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            border: 1px solid transparent;
        }
        .badge-green {
            background-color: #E6F8E8;
            color: #204E2B;
            border-color: #C2E9C6;
        }
        .badge-red {
            background-color: #FFDAD6;
            color: #93000A;
            border-color: #FFB4AB;
        }
        .badge-yellow {
            background-color: #FEF3C7;
            color: #92400E;
            border-color: #FDE68A;
        }
        .error-title {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 800;
            font-size: 22px;
            color: #101F15;
            line-height: 1.3;
            margin-bottom: 10px;
        }
        .error-desc {
            font-size: 14px;
            color: #414941;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        @media (min-width: 640px) {
            .btn-group {
                flex-direction: row;
            }
        }
        .btn {
            flex: 1;
            padding: 12px 18px;
            border-radius: 14px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 700;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }
        .btn-primary {
            background-color: #386641;
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(56, 102, 65, 0.2);
        }
        .btn-primary:hover {
            background-color: #204E2B;
        }
        .btn-secondary {
            background-color: #F4F7F4;
            color: #204E2B;
            border: 1px solid #E1F2E2;
        }
        .btn-secondary:hover {
            background-color: #E1F2E2;
        }
        .sublink {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #E1F2E2;
        }
        .sublink a {
            font-size: 12px;
            font-weight: 600;
            color: #386641;
            text-decoration: none;
        }
        .sublink a:hover {
            text-decoration: underline;
        }
        .footer {
            padding: 20px 16px;
            text-align: center;
            border-top: 1px solid #E1F2E2;
            background-color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            color: #727970;
        }
    </style>
</head>
<body>
    <!-- Top Header -->
    <header class="header">
        <div class="header-container">
            <a href="/" class="branding">
                <img src="/images/logo2.png" alt="Logo Sekolah" onerror="this.style.display='none'">
                <div>
                    <span class="branding-title">PEMILU PPTS</span>
                    <span class="branding-subtitle">SMA TAMANSISWA MOJOKERTO</span>
                </div>
            </a>
            <div class="header-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#386641" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span>Sistem Resmi</span>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="error-card">
            @yield('content')

            <div class="btn-group">
                <a href="/" class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Kembali ke Beranda</span>
                </a>
                <button type="button" onclick="window.location.reload()" class="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                        <path d="M16 21h5v-5"></path>
                    </svg>
                    <span>Muat Ulang</span>
                </button>
            </div>

            <div class="sublink">
                <a href="/login">&rarr; Menuju Halaman Masuk Bilik Suara</a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        &copy; {{ date('Y') }} Sistem Pemilu PPTS &bull; SMA Tamansiswa Mojokerto. Seluruh hak cipta dilindungi.
    </footer>
</body>
</html>

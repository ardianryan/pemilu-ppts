<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Candidate;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Default Admin
        Admin::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator KPU PPTS',
                'email' => 'admin@smatamansiswa-mojokerto.sch.id',
                'password' => Hash::make('admin123'),
                'role' => 'superadmin',
                'is_active' => true,
            ]
        );

        Admin::firstOrCreate(
            ['username' => 'panitia'],
            [
                'name' => 'Panitia Bilik Suara',
                'email' => 'panitia@smatamansiswa-mojokerto.sch.id',
                'password' => Hash::make('panitia123'),
                'role' => 'panitia',
                'is_active' => true,
            ]
        );

        // 2. Seed Candidates (SMA Tamansiswa Mojokerto)
        $candidates = [
            [
                'candidate_number' => 1,
                'chairman_name' => 'Rafi Ardian',
                'vice_chairman_name' => 'Syifa Amanda',
                'tagline' => 'Ketertiban Belajar & Kebersamaan Siswa',
                'vision' => 'Mewujudkan PPTS SMA Tamansiswa Mojokerto yang aktif mendengarkan masukan siswa, tertib dalam kegiatan sekolah, dan saling mendukung.',
                'mission' => [
                    'Mengaktifkan kembali kotak saran dan mading sekolah untuk menyalurkan aspirasi setiap kelas.',
                    'Menyelenggarakan kompetisi olahraga dan seni antar-kelas secara rutin setiap semester.',
                    'Mendukung penataan lingkungan kelas yang bersih, rapi, dan nyaman untuk belajar.',
                ],
                'photo_path' => null,
                'color_accent' => '#386641',
                'vote_count' => 0,
                'is_active' => true,
            ],
            [
                'candidate_number' => 2,
                'chairman_name' => 'Dimas Pratama',
                'vice_chairman_name' => 'Nayla Azzahra',
                'tagline' => 'Penguatan Ekstrakurikuler & Karakter',
                'vision' => 'Menjadikan PPTS sebagai sarana pengembangan minat, bakat, serta kedisiplinan pelajar SMA Tamansiswa Mojokerto.',
                'mission' => [
                    'Membantu publisitas dan fasilitas kegiatan seluruh unit ekstrakurikuler sekolah.',
                    'Mengadakan kegiatan kebersamaan antar-angkatan untuk mempererat silaturahmi antar-siswa.',
                    'Mendorong budaya saling menghargai dan menolak segala bentuk perundungan di sekolah.',
                ],
                'photo_path' => null,
                'color_accent' => '#3d6924',
                'vote_count' => 0,
                'is_active' => true,
            ],
            [
                'candidate_number' => 3,
                'chairman_name' => 'Arya Wicaksana',
                'vice_chairman_name' => 'Zahra Kirana',
                'tagline' => 'Kreativitas Pelajar & Transparansi Kegiatan',
                'vision' => 'Mewujudkan kepengurusan PPTS yang terbuka, bertanggung jawab, dan mengutamakan program kerja yang bermanfaat bagi siswa.',
                'mission' => [
                    'Menyampaikan laporan kegiatan dan penggunaan dana PPTS secara terbuka kepada perwakilan kelas.',
                    'Mengadakan bazaar kewirausahaan siswa dan pameran karya seni saat acara sekolah.',
                    'Memfasilitasi kelompok belajar siswa menjelang ujian semester dan ujian akhir.',
                ],
                'photo_path' => null,
                'color_accent' => '#384c00',
                'vote_count' => 0,
                'is_active' => true,
            ],
        ];

        foreach ($candidates as $cand) {
            Candidate::updateOrCreate(
                ['candidate_number' => $cand['candidate_number']],
                $cand
            );
        }

        // 3. Seed Sample Voters (Siswa, Pamong Guru, & Tendik)
        $sampleVoters = [
            ['nisn' => '0061234501', 'name' => 'Aditya Pratama Putra', 'grade' => 'X', 'class_room' => 'X-1'],
            ['nisn' => '0061234502', 'name' => 'Alya Rahmadhani', 'grade' => 'X', 'class_room' => 'X-1'],
            ['nisn' => '0061234503', 'name' => 'Bima Bagus Saputra', 'grade' => 'X', 'class_room' => 'X-2'],
            ['nisn' => '0061234504', 'name' => 'Citra Dewi Lestari', 'grade' => 'X', 'class_room' => 'X-2'],
            ['nisn' => '0061234505', 'name' => 'Dimas Arya Nugraha', 'grade' => 'XI', 'class_room' => 'XI-MIPA-1'],
            ['nisn' => '0061234506', 'name' => 'Farah Nabila Putri', 'grade' => 'XI', 'class_room' => 'XI-MIPA-1'],
            ['nisn' => '0061234507', 'name' => 'Gilang Ramadhan', 'grade' => 'XI', 'class_room' => 'XI-IPS-1'],
            ['nisn' => '0061234508', 'name' => 'Hana Fauziah Zahra', 'grade' => 'XI', 'class_room' => 'XI-IPS-2'],
            ['nisn' => '0061234509', 'name' => 'Irfan Maulana Hakim', 'grade' => 'XII', 'class_room' => 'XII-MIPA-1'],
            ['nisn' => '0061234510', 'name' => 'Jihan Kirana Azzahra', 'grade' => 'XII', 'class_room' => 'XII-MIPA-1'],
            ['nisn' => '0061234511', 'name' => 'Kevin Rizky Ananda', 'grade' => 'XII', 'class_room' => 'XII-MIPA-2'],
            ['nisn' => '0061234512', 'name' => 'Lestari Indah Wati', 'grade' => 'XII', 'class_room' => 'XII-IPS-1'],
            ['nisn' => '0061234513', 'name' => 'Muhammad Fajar Sidik', 'grade' => 'XII', 'class_room' => 'XII-IPS-2'],
            ['nisn' => '0061234514', 'name' => 'Nadya Putri Salsabila', 'grade' => 'XII', 'class_room' => 'XII-BAHASA'],
            ['nisn' => '0061234515', 'name' => 'Okta Vian Dwi Cahyo', 'grade' => 'XII', 'class_room' => 'XII-BAHASA'],
            // Pamong Guru & Tendik
            ['nisn' => '1985010101', 'name' => 'Drs. Bambang Hariyanto M.Pd.', 'grade' => 'GURU', 'class_room' => 'Guru Pamong'],
            ['nisn' => '1990020202', 'name' => 'Endang Rahayu S.Pd.', 'grade' => 'GURU', 'class_room' => 'Guru Pamong'],
            ['nisn' => '1995030303', 'name' => 'Sri Wahyuni S.E.', 'grade' => 'TENDIK', 'class_room' => 'Staf Tata Usaha'],
        ];

        foreach ($sampleVoters as $voterData) {
            $existing = Voter::where('nisn', $voterData['nisn'])->first();
            if (!$existing) {
                Voter::create(array_merge($voterData, [
                    'token' => Voter::generateUniqueToken(),
                    'has_voted' => false
                ]));
            } else {
                $existing->update([
                    'token' => Voter::generateUniqueToken(),
                    'has_voted' => false
                ]);
            }
        }

        // 4. Seed Election Settings
        ElectionSetting::current();
    }
}

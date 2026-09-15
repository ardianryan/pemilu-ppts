<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElectionSetting;
use App\Models\Voter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VoterController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Voter::query();

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhere('token', 'like', "%{$search}%")
                  ->orWhere('class_room', 'like', "%{$search}%");
            });
        }

        if ($request->filled('grade')) {
            $query->where('grade', $request->grade);
        }

        if ($request->filled('class_room')) {
            $query->where('class_room', $request->class_room);
        }

        if ($request->filled('status')) {
            if ($request->status === 'voted') {
                $query->where('has_voted', true);
            } elseif ($request->status === 'not_voted') {
                $query->where('has_voted', false);
            }
        }

        $perPage = in_array((int) $request->per_page, [10, 20, 50, 100]) ? (int) $request->per_page : 20;

        $voters = $query->orderBy('class_room', 'asc')
            ->orderBy('name', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        $classes = Voter::distinct()->orderBy('class_room')->pluck('class_room');

        return Inertia::render('Admin/Voters/Index', [
            'voters' => $voters,
            'classes' => $classes,
            'filters' => $request->only(['search', 'grade', 'class_room', 'status', 'per_page']),
            'stats' => [
                'total' => Voter::count(),
                'voted' => Voter::where('has_voted', true)->count(),
                'not_voted' => Voter::where('has_voted', false)->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|size:10|unique:voters,nisn',
            'token' => 'nullable|string|min:3|max:20|unique:voters,token',
            'name' => 'required|string|max:120',
            'grade' => 'required|string|max:30',
            'class_room' => 'required|string|max:50',
        ]);

        if (empty($validated['token'])) {
            $validated['token'] = Voter::generateUniqueToken();
        } else {
            $validated['token'] = strtoupper(trim($validated['token']));
        }

        Voter::create($validated);

        return redirect()->back()->with('success', 'Data Pemilih & Token berhasil ditambahkan.');
    }

    public function update(Request $request, Voter $voter)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|size:10|unique:voters,nisn,' . $voter->id,
            'token' => 'required|string|min:3|max:20|unique:voters,token,' . $voter->id,
            'name' => 'required|string|max:120',
            'grade' => 'required|string|max:30',
            'class_room' => 'required|string|max:50',
        ]);

        $validated['token'] = strtoupper(trim($validated['token']));
        $voter->update($validated);

        return redirect()->back()->with('success', 'Data Pemilih berhasil diperbarui.');
    }

    public function destroy(Voter $voter)
    {
        $voter->delete();

        return redirect()->back()->with('success', 'Data Pemilih berhasil dihapus.');
    }

    public function resetStatus(Voter $voter)
    {
        $voter->update([
            'has_voted' => false,
            'voted_at' => null,
            'receipt_token' => null,
            'voting_session_id' => null,
        ]);

        return redirect()->back()->with('success', "Status suara {$voter->name} berhasil direset (Dapat memilih kembali).");
    }

    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template DPT');

        // Header Styling
        $headers = ['Kode Akses / NISN', 'Nama Lengkap Pemilih', 'Kelas / Jabatan', 'Kategori (X/XI/XII/GURU/TENDIK)'];
        $sheet->fromArray([$headers], null, 'A1');

        $headerRange = 'A1:D1';
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '386641'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(28);

        // Sample Data Rows
        $sampleData = [
            ['0061234501', 'Aditya Pratama Putra', 'X-1', 'X'],
            ['0061234502', 'Alya Rahmadhani', 'XI-MIPA-1', 'XI'],
            ['0061234503', 'Citra Dewi Lestari', 'XII-IPS-2', 'XII'],
            ['1985010101', 'Drs. Bambang Hariyanto M.Pd.', 'Guru Pamong', 'GURU'],
            ['1995030303', 'Sri Wahyuni S.E.', 'Staf Tata Usaha', 'TENDIK'],
        ];

        $sheet->fromArray($sampleData, null, 'A2');

        // Format NISN column as text
        $sheet->getStyle('A2:A100')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);

        foreach (range('A', 'D') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'Template_DPT_Pilketos.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        $importedCount = 0;
        $updatedCount = 0;

        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Remove header row
            if (count($rows) > 0) {
                array_shift($rows);
            }

            foreach ($rows as $row) {
                if (empty($row) || !isset($row[0])) continue;

                $nisn = trim((string)$row[0]);
                $name = trim((string)($row[1] ?? ''));
                $classRoom = trim((string)($row[2] ?? 'Umum'));
                $grade = strtoupper(trim((string)($row[3] ?? 'X')));
                $token = !empty($row[4]) ? strtoupper(trim((string)$row[4])) : null;

                if (empty($nisn) || empty($name)) continue;

                if (empty($grade)) {
                    $grade = 'X';
                }

                $existing = Voter::where('nisn', $nisn)->first();

                if ($existing) {
                    $existing->update([
                        'name' => $name,
                        'class_room' => $classRoom,
                        'grade' => $grade,
                        'token' => $token ?: $existing->token,
                    ]);
                    $updatedCount++;
                } else {
                    Voter::create([
                        'nisn' => $nisn,
                        'token' => $token ?: Voter::generateUniqueToken(),
                        'name' => $name,
                        'class_room' => $classRoom,
                        'grade' => $grade,
                    ]);
                    $importedCount++;
                }
            }
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'file' => 'Gagal membaca file Excel/CSV: ' . $e->getMessage(),
            ]);
        }

        return redirect()->back()->with('success', "Import selesai: {$importedCount} pemilih baru ditambahkan (token otomatis dibuat), {$updatedCount} pemilih diperbarui.");
    }

    public function export(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('DPT & Token');

        $headers = ['Kode Akses / NISN', 'Token Akses', 'Nama Lengkap Pemilih', 'Kategori', 'Kelas / Jabatan', 'Status Memilih', 'Waktu Rekam Suara'];
        $sheet->fromArray([$headers], null, 'A1');

        $sheet->getStyle('A1:G1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '386641'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(25);

        $voters = Voter::orderBy('class_room')->orderBy('name')->get();
        $dataRows = [];

        foreach ($voters as $v) {
            $dataRows[] = [
                (string)$v->nisn,
                (string)$v->token,
                $v->name,
                $v->grade === 'GURU' ? 'Guru Pamong' : ($v->grade === 'TENDIK' ? 'Tendik' : 'Kelas ' . $v->grade),
                $v->class_room,
                $v->has_voted ? 'SUDAH MEMILIH' : 'BELUM',
                $v->voted_at ? $v->voted_at->toDateTimeString() : '-',
            ];
        }

        if (!empty($dataRows)) {
            $sheet->fromArray($dataRows, null, 'A2');
        }

        foreach (range('A', 'G') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'DPT_Pemilih_Token_' . date('Ymd_His') . '.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function printCards(Request $request): Response
    {
        $query = Voter::query();

        if ($request->filled('ids')) {
            $ids = is_array($request->ids) ? $request->ids : explode(',', $request->ids);
            $query->whereIn('id', array_filter($ids));
        } else {
            if ($request->filled('search')) {
                $search = trim($request->search);
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nisn', 'like', "%{$search}%")
                      ->orWhere('token', 'like', "%{$search}%")
                      ->orWhere('class_room', 'like', "%{$search}%");
                });
            }

            if ($request->filled('grade')) {
                $query->where('grade', $request->grade);
            }

            if ($request->filled('class_room')) {
                $query->where('class_room', $request->class_room);
            }

            if ($request->filled('status')) {
                if ($request->status === 'voted') {
                    $query->where('has_voted', true);
                } elseif ($request->status === 'not_voted') {
                    $query->where('has_voted', false);
                }
            }
        }

        $voters = $query->orderBy('class_room', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $setting = ElectionSetting::current();

        return Inertia::render('Admin/Voters/PrintCards', [
            'voters' => $voters,
            'setting' => $setting,
            'filters' => $request->only(['search', 'grade', 'class_room', 'status', 'ids']),
        ]);
    }
}

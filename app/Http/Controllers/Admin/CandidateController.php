<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CandidateController extends Controller
{
    public function index(): Response
    {
        $candidates = Candidate::orderBy('candidate_number', 'asc')->get();

        return Inertia::render('Admin/Candidates/Index', [
            'candidates' => $candidates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_number' => 'required|integer|unique:candidates,candidate_number',
            'chairman_name' => 'required|string|max:100',
            'vice_chairman_name' => 'required|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'vision' => 'required|string',
            'mission' => 'required|array|min:1',
            'mission.*' => 'required|string',
            'color_accent' => 'nullable|string|max:30',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120', // max 5MB
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $disk = env('FILESYSTEM_DISK', 'public');
            $storedPath = $request->file('photo')->store('candidates', $disk);
            $photoPath = Storage::disk($disk)->url($storedPath);
        }

        Candidate::create([
            'candidate_number' => $validated['candidate_number'],
            'chairman_name' => $validated['chairman_name'],
            'vice_chairman_name' => $validated['vice_chairman_name'],
            'tagline' => $validated['tagline'] ?? null,
            'vision' => $validated['vision'],
            'mission' => array_values(array_filter($validated['mission'])),
            'photo_path' => $photoPath,
            'color_accent' => $validated['color_accent'] ?? '#386641',
            'vote_count' => 0,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Data Paslon berhasil ditambahkan.');
    }

    public function update(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'candidate_number' => 'required|integer|unique:candidates,candidate_number,'.$candidate->id,
            'chairman_name' => 'required|string|max:100',
            'vice_chairman_name' => 'required|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'vision' => 'required|string',
            'mission' => 'required|array|min:1',
            'mission.*' => 'required|string',
            'color_accent' => 'nullable|string|max:30',
            'is_active' => 'boolean',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $data = [
            'candidate_number' => $validated['candidate_number'],
            'chairman_name' => $validated['chairman_name'],
            'vice_chairman_name' => $validated['vice_chairman_name'],
            'tagline' => $validated['tagline'] ?? null,
            'vision' => $validated['vision'],
            'mission' => array_values(array_filter($validated['mission'])),
            'color_accent' => $validated['color_accent'] ?? '#386641',
            'is_active' => $validated['is_active'] ?? true,
        ];

        if ($request->hasFile('photo')) {
            $disk = env('FILESYSTEM_DISK', 'public');
            if ($candidate->photo_path) {
                $oldRelativePath = ltrim(parse_url($candidate->photo_path, PHP_URL_PATH), '/');
                $oldRelativePath = str_replace('storage/', '', $oldRelativePath);
                Storage::disk($disk)->delete($oldRelativePath);
            }
            $storedPath = $request->file('photo')->store('candidates', $disk);
            $data['photo_path'] = Storage::disk($disk)->url($storedPath);
        }

        $candidate->update($data);

        return redirect()->back()->with('success', 'Data Paslon berhasil diperbarui.');
    }

    public function destroy(Candidate $candidate)
    {
        if ($candidate->photo_path) {
            $disk = env('FILESYSTEM_DISK', 'public');
            $oldRelativePath = ltrim(parse_url($candidate->photo_path, PHP_URL_PATH), '/');
            $oldRelativePath = str_replace('storage/', '', $oldRelativePath);
            Storage::disk($disk)->delete($oldRelativePath);
        }

        $candidate->delete();

        return redirect()->back()->with('success', 'Paslon berhasil dihapus.');
    }
}

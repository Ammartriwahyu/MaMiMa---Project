<?php
namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlaceController extends Controller
{
    // GET /api/places
    public function index(Request $request): JsonResponse
    {
        $query = Place::with(['user', 'categories']);
        $auth  = $request->user()?->id;

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('bio', 'like', "%$s%")
                  ->orWhere('address', 'like', "%$s%");
            });
        }

        if ($request->filled('lokasi')) {
            $query->where('lokasi', $request->lokasi);
        }

        // Filter by type: ?type[]=makan&type[]=minum  OR  ?type=makan
        if ($request->filled('type')) {
            $types = (array) $request->type;
            $query->where(function ($q) use ($types) {
                foreach ($types as $t) {
                    $q->orWhereJsonContains('types', $t);
                }
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('categories', fn($q) => $q->where('slug', $request->category));
        }

        $places = $query->latest()->get();

        return response()->json([
            'data' => $places->map(fn($p) => $p->toApiArray($auth)),
        ]);
    }

    // GET /api/places/{id}
    public function show(Request $request, Place $place): JsonResponse
    {
        $place->load(['user', 'categories', 'menus']);
        return response()->json([
            'data' => $place->toApiArray($request->user()?->id),
        ]);
    }

    // POST /api/places
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'bio'         => 'nullable|string|max:1000',
            'types'       => 'required|array|min:1',
            'types.*'     => 'in:makan,minum',
            'lokasi'      => 'required|in:merjosari,watugong,suhat,sigura-gura,dinoyo',
            'address'     => 'required|string|max:255',
            'price_range' => 'nullable|string|max:100',
            'open_hours'  => 'nullable|string|max:100',
            'phone'       => 'nullable|string|max:20',
            'whatsapp'    => 'nullable|string|max:20',
            'latitude'    => 'nullable|numeric|between:-90,90',
            'longitude'   => 'nullable|numeric|between:-180,180',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'categories'  => 'nullable|array',
            'categories.*'=> 'exists:categories,id',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images/places', 'public');
        }

        // Clean WhatsApp number: remove spaces, dashes, leading 0 → 62
        $wa = $this->cleanWhatsApp($request->whatsapp);

        $place = Place::create([
            'user_id'     => $request->user()->id,
            'name'        => $request->name,
            'bio'         => $request->bio,
            'types'       => $request->types,
            'lokasi'      => $request->lokasi,
            'address'     => $request->address,
            'price_range' => $request->price_range,
            'open_hours'  => $request->open_hours,
            'phone'       => $request->phone,
            'whatsapp'    => $wa,
            'latitude'    => $request->latitude,
            'longitude'   => $request->longitude,
            'image'       => $imagePath,
        ]);

        if ($request->categories) {
            $place->categories()->sync($request->categories);
        }

        $place->load(['user', 'categories']);
        return response()->json(['message' => 'Tempat berhasil ditambahkan!', 'data' => $place->toApiArray($request->user()->id)], 201);
    }

    // POST /api/places/{id}  (_method=PUT)
    public function update(Request $request, Place $place): JsonResponse
    {
        if ($request->user()->id !== $place->user_id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'bio'         => 'nullable|string|max:1000',
            'types'       => 'sometimes|array|min:1',
            'types.*'     => 'in:makan,minum',
            'lokasi'      => 'sometimes|required|in:merjosari,watugong,suhat,sigura-gura,dinoyo',
            'address'     => 'sometimes|required|string|max:255',
            'price_range' => 'nullable|string|max:100',
            'open_hours'  => 'nullable|string|max:100',
            'phone'       => 'nullable|string|max:20',
            'whatsapp'    => 'nullable|string|max:20',
            'latitude'    => 'nullable|numeric|between:-90,90',
            'longitude'   => 'nullable|numeric|between:-180,180',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'categories'  => 'nullable|array',
            'categories.*'=> 'exists:categories,id',
        ]);

        if ($request->hasFile('image')) {
            if ($place->image) Storage::disk('public')->delete($place->image);
            $place->image = $request->file('image')->store('images/places', 'public');
        }

        $wa = $request->filled('whatsapp') ? $this->cleanWhatsApp($request->whatsapp) : $place->whatsapp;

        $place->fill(array_merge(
            $request->only(['name', 'bio', 'types', 'lokasi', 'address', 'price_range', 'open_hours', 'phone', 'latitude', 'longitude']),
            ['whatsapp' => $wa]
        ));
        $place->save();

        if ($request->has('categories')) {
            $place->categories()->sync($request->categories ?? []);
        }

        $place->load(['user', 'categories']);
        return response()->json(['message' => 'Tempat berhasil diupdate!', 'data' => $place->toApiArray($request->user()->id)]);
    }

    // DELETE /api/places/{id}
    public function destroy(Request $request, Place $place): JsonResponse
    {
        if ($request->user()->id !== $place->user_id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }
        if ($place->image) Storage::disk('public')->delete($place->image);
        $place->delete();
        return response()->json(['message' => 'Tempat berhasil dihapus.']);
    }

    // ─── Helper ──────────────────────────────────────────────────────────────
    private function cleanWhatsApp(?string $number): ?string
    {
        if (!$number) return null;
        $clean = preg_replace('/[^0-9]/', '', $number);
        if (str_starts_with($clean, '0')) {
            $clean = '62' . substr($clean, 1);
        }
        if (!str_starts_with($clean, '62')) {
            $clean = '62' . $clean;
        }
        return $clean;
    }
}

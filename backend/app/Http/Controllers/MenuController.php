<?php
namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // GET /api/places/{place}/menus
    public function index(Place $place): JsonResponse
    {
        return response()->json([
            'data' => $place->menus->map(fn($m) => $m->toApiArray()),
        ]);
    }

    // POST /api/places/{place}/menus
    public function store(Request $request, Place $place): JsonResponse
    {
        if ($request->user()->id !== $place->user_id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|integer|min:0',
            'description' => 'nullable|string|max:500',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images/menus', 'public');
        }

        $menu = $place->menus()->create([
            'name'        => $request->name,
            'price'       => $request->price,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return response()->json(['message' => 'Menu berhasil ditambahkan!', 'data' => $menu->toApiArray()], 201);
    }

    // POST /api/menus/{menu}  (_method=PUT)
    public function update(Request $request, Menu $menu): JsonResponse
    {
        if ($request->user()->id !== $menu->place->user_id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|integer|min:0',
            'description' => 'nullable|string|max:500',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        if ($request->hasFile('image')) {
            if ($menu->image) Storage::disk('public')->delete($menu->image);
            $menu->image = $request->file('image')->store('images/menus', 'public');
        }

        $menu->fill($request->only(['name', 'price', 'description']));
        $menu->save();

        return response()->json(['message' => 'Menu berhasil diupdate!', 'data' => $menu->toApiArray()]);
    }

    // DELETE /api/menus/{menu}
    public function destroy(Request $request, Menu $menu): JsonResponse
    {
        if ($request->user()->id !== $menu->place->user_id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }
        if ($menu->image) Storage::disk('public')->delete($menu->image);
        $menu->delete();
        return response()->json(['message' => 'Menu berhasil dihapus.']);
    }
}

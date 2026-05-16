<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // GET /api/users/{username}
    public function show(string $username): JsonResponse
    {
        $user = User::where('username', $username)->firstOrFail();
        return response()->json(['data' => $user->toApiArray()]);
    }

    // POST /api/users/{username}  (_method=PUT)
    public function update(Request $request, string $username): JsonResponse
    {
        $user = User::where('username', $username)->firstOrFail();

        if ($request->user()->id !== $user->id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'username'    => 'sometimes|required|string|max:50|alpha_dash|unique:users,username,' . $user->id,
            'bio'         => 'nullable|string|max:500',
            'avatar'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) Storage::disk('public')->delete($user->avatar);
            $user->avatar = $request->file('avatar')->store('images/avatars', 'public');
        }
        if ($request->hasFile('cover_image')) {
            if ($user->cover_image) Storage::disk('public')->delete($user->cover_image);
            $user->cover_image = $request->file('cover_image')->store('images/covers', 'public');
        }

        $user->fill($request->only(['name', 'username', 'bio']));
        $user->save();

        return response()->json(['message' => 'Profil berhasil diupdate!', 'user' => $user->fresh()->toApiArray()]);
    }

    // GET /api/users/{username}/places
    public function places(Request $request, string $username): JsonResponse
    {
        $user   = User::where('username', $username)->firstOrFail();
        $places = $user->places()->with(['user', 'categories'])->latest()->get();
        $authId = $request->user()?->id;

        return response()->json([
            'data' => $places->map(fn($p) => $p->toApiArray($authId)),
        ]);
    }
}

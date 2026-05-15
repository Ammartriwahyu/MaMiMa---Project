<?php
namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    // POST /api/places/{place}/bookmark  (toggle)
    public function toggle(Request $request, Place $place): JsonResponse
    {
        $user     = $request->user();
        $bookmark = $place->bookmarks()->where('user_id', $user->id)->first();

        if ($bookmark) {
            $bookmark->delete();
            $place->decrement('saves_count');
            $bookmarked = false;
        } else {
            $place->bookmarks()->create(['user_id' => $user->id]);
            $place->increment('saves_count');
            $bookmarked = true;
        }

        return response()->json([
            'bookmarked' => $bookmarked,
            'savesCount' => $place->fresh()->saves_count,
        ]);
    }

    // GET /api/bookmarks  — list current user's bookmarks
    public function index(Request $request): JsonResponse
    {
        $user      = $request->user();
        $bookmarks = $user->bookmarks()->with(['place.user', 'place.categories'])->latest()->get();

        return response()->json([
            'data' => $bookmarks->map(fn($b) => $b->place->toApiArray($user->id)),
        ]);
    }
}

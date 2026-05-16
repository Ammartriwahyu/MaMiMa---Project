<?php
namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    // POST /api/places/{place}/like  (toggle)
    public function toggle(Request $request, Place $place): JsonResponse
    {
        $user = $request->user();
        $like = $place->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $place->decrement('likes_count');
            $liked = false;
        } else {
            $place->likes()->create(['user_id' => $user->id]);
            $place->increment('likes_count');
            $liked = true;
        }

        return response()->json([
            'liked'      => $liked,
            'likesCount' => $place->fresh()->likes_count,
        ]);
    }
}

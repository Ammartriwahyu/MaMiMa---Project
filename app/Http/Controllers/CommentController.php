<?php
namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // GET /api/places/{place}/comments
    public function index(Place $place): JsonResponse
    {
        $comments = $place->comments()->with('user')->latest()->get();
        return response()->json([
            'data' => $comments->map(fn($c) => $c->toApiArray()),
        ]);
    }

    // POST /api/places/{place}/comments
    public function store(Request $request, Place $place): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $place->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);
        $comment->load('user');

        return response()->json([
            'message' => 'Komentar berhasil ditambahkan!',
            'data'    => $comment->toApiArray(),
        ], 201);
    }

    // DELETE /api/comments/{comment}
    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }
        $comment->delete();
        return response()->json(['message' => 'Komentar berhasil dihapus.']);
    }
}

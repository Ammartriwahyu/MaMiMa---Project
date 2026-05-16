<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ─── Public ──────────────────────────────────────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{place}', [PlaceController::class, 'show']);
Route::get('/places/{place}/menus', [MenuController::class, 'index']);
Route::get('/places/{place}/comments', [CommentController::class, 'index']);
Route::get('/users/{username}', [UserController::class, 'show']);
Route::get('/users/{username}/places', [UserController::class, 'places']);

// ─── Protected ───────────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Places CRUD
    Route::post('/places', [PlaceController::class, 'store']);
    Route::match(['POST', 'PUT', 'PATCH'], '/places/{place}', [PlaceController::class, 'update']);
    Route::delete('/places/{place}', [PlaceController::class, 'destroy']);

    // Menus CRUD
    Route::post('/places/{place}/menus', [MenuController::class, 'store']);
    Route::match(['POST', 'PUT', 'PATCH'], '/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);

    // Comments
    Route::post('/places/{place}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Like / Bookmark (toggle)
    Route::post('/places/{place}/like', [LikeController::class, 'toggle']);
    Route::post('/places/{place}/bookmark', [BookmarkController::class, 'toggle']);
    Route::get('/bookmarks', [BookmarkController::class, 'index']);

    // Profile
    Route::match(['POST', 'PUT', 'PATCH'], '/users/{username}', [UserController::class, 'update']);
});

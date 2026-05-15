<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'username', 'email', 'password',
        'bio', 'avatar', 'cover_image',
        'followers_count', 'following_count',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['password' => 'hashed'];

    // ─── Relations ───────────────────────────────────────────────────────────
    public function places()    { return $this->hasMany(Place::class); }
    public function comments()  { return $this->hasMany(Comment::class); }
    public function likes()     { return $this->hasMany(Like::class); }
    public function bookmarks() { return $this->hasMany(Bookmark::class); }

    // ─── Accessors ───────────────────────────────────────────────────────────
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? asset('storage/' . $this->cover_image) : null;
    }

    // ─── API Array ───────────────────────────────────────────────────────────
    public function toApiArray(): array
    {
        return [
            'id'             => $this->id,
            'username'       => $this->username,
            'displayName'    => $this->name,
            'email'          => $this->email,
            'bio'            => $this->bio,
            'avatar'         => $this->avatar_url,
            'coverImage'     => $this->cover_image_url,
            'followersCount' => $this->followers_count,
            'followingCount' => $this->following_count,
            'joinedAt'       => $this->created_at?->format('Y-m-d'),
        ];
    }
}

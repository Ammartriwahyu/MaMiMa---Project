<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'bio', 'types', 'lokasi', 'address',
        'price_range', 'open_hours', 'phone', 'whatsapp',
        'image', 'latitude', 'longitude',
        'rating', 'review_count', 'likes_count', 'saves_count', 'is_verified',
    ];

    protected $casts = [
        'types'       => 'array',
        'is_verified' => 'boolean',
        'latitude'    => 'float',
        'longitude'   => 'float',
        'rating'      => 'float',
    ];

    // ─── Relations ───────────────────────────────────────────────────────────
    public function user()       { return $this->belongsTo(User::class); }
    public function categories() { return $this->belongsToMany(Category::class, 'place_categories'); }
    public function menus()      { return $this->hasMany(Menu::class); }
    public function comments()   { return $this->hasMany(Comment::class)->latest(); }
    public function likes()      { return $this->hasMany(Like::class); }
    public function bookmarks()  { return $this->hasMany(Bookmark::class); }

    // ─── Accessors ───────────────────────────────────────────────────────────
    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    // ─── API Array ───────────────────────────────────────────────────────────
    public function toApiArray(?int $authUserId = null): array
    {
        return [
            'id'           => $this->id,
            'userId'       => $this->user_id,
            'username'     => $this->user?->username,
            'userAvatar'   => $this->user?->avatar_url,
            'userDisplay'  => $this->user?->name,
            'name'         => $this->name,
            'bio'          => $this->bio,
            'types'        => $this->types ?? [],
            'lokasi'       => $this->lokasi,
            'address'      => $this->address,
            'priceRange'   => $this->price_range,
            'openHours'    => $this->open_hours,
            'phone'        => $this->phone,
            'whatsapp'     => $this->whatsapp,
            'image'        => $this->image_url,
            'latitude'     => $this->latitude,
            'longitude'    => $this->longitude,
            'categories'   => $this->categories->map(fn($c) => $c->toApiArray())->values(),
            'rating'       => $this->rating,
            'reviewCount'  => $this->review_count,
            'likesCount'   => $this->likes_count,
            'savesCount'   => $this->saves_count,
            'isVerified'   => $this->is_verified,
            'isLiked'      => $authUserId ? $this->likes()->where('user_id', $authUserId)->exists() : false,
            'isBookmarked' => $authUserId ? $this->bookmarks()->where('user_id', $authUserId)->exists() : false,
            'createdAt'    => $this->created_at?->format('Y-m-d'),
        ];
    }
}

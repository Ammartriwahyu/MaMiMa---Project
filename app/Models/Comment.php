<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'place_id', 'content'];

    public function user()  { return $this->belongsTo(User::class); }
    public function place() { return $this->belongsTo(Place::class); }

    public function toApiArray(): array
    {
        return [
            'id'          => $this->id,
            'userId'      => $this->user_id,
            'username'    => $this->user?->username,
            'userAvatar'  => $this->user?->avatar_url,
            'userDisplay' => $this->user?->name,
            'content'     => $this->content,
            'createdAt'   => $this->created_at?->diffForHumans(),
            'createdRaw'  => $this->created_at?->toISOString(),
        ];
    }
}

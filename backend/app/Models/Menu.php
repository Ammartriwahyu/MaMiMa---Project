<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = ['place_id', 'name', 'price', 'description', 'image'];

    public function place() { return $this->belongsTo(Place::class); }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function toApiArray(): array
    {
        return [
            'id'          => $this->id,
            'placeId'     => $this->place_id,
            'name'        => $this->name,
            'price'       => $this->price,
            'description' => $this->description,
            'image'       => $this->image_url,
        ];
    }
}

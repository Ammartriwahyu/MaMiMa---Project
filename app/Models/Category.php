<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'emoji', 'color'];

    public function places() { return $this->belongsToMany(Place::class, 'place_categories'); }

    public function toApiArray(): array
    {
        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'slug'  => $this->slug,
            'emoji' => $this->emoji,
            'color' => $this->color,
        ];
    }
}

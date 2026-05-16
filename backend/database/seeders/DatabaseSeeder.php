<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Categories ─────────────────────────
        $categories = [
            ['name' => 'Warung',      'slug' => 'warung',      'emoji' => '🍽️', 'color' => 'bg-orange-100 text-orange-700'],
            ['name' => 'Kafe',        'slug' => 'kafe',        'emoji' => '☕',  'color' => 'bg-amber-100 text-amber-700'],
            ['name' => 'Restoran',    'slug' => 'restoran',    'emoji' => '🏪',  'color' => 'bg-red-100 text-red-700'],
            ['name' => 'Street Food', 'slug' => 'street-food', 'emoji' => '🥡',  'color' => 'bg-yellow-100 text-yellow-700'],
            ['name' => 'Bakery',      'slug' => 'bakery',      'emoji' => '🥐',  'color' => 'bg-pink-100 text-pink-700'],
            ['name' => 'Juice Bar',   'slug' => 'juice-bar',   'emoji' => '🥤',  'color' => 'bg-green-100 text-green-700'],
            ['name' => 'Dessert',     'slug' => 'dessert',     'emoji' => '🍰',  'color' => 'bg-purple-100 text-purple-700'],
            ['name' => 'Boba',        'slug' => 'boba',        'emoji' => '🧋',  'color' => 'bg-blue-100 text-blue-700'],
        ];
        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // ─── Demo Users ──────────────────────────
        $user1 = User::firstOrCreate(['email' => 'foodie@example.com'], [
            'name'     => 'Foodie Malang',
            'username' => 'foodie_malang',
            'password' => Hash::make('password123'),
            'bio'      => 'Pecinta kuliner Malang 🍜',
        ]);

        $user2 = User::firstOrCreate(['email' => 'kuliner@example.com'], [
            'name'     => 'Kuliner Joss',
            'username' => 'kuliner_joss',
            'password' => Hash::make('password123'),
            'bio'      => 'Content creator kuliner 📸',
        ]);

        // ─── Demo Places ─────────────────────────
        $warung = Category::where('slug', 'warung')->first();
        $kafe   = Category::where('slug', 'kafe')->first();
        $boba   = Category::where('slug', 'boba')->first();

        $p1 = Place::firstOrCreate(['name' => 'Warung Soto Lamongan Pak Dhe'], [
            'user_id'     => $user1->id,
            'bio'         => 'Soto lamongan otentik dengan kuah bening yang segar.',
            'types'       => ['makan'],
            'lokasi'      => 'merjosari',
            'address'     => 'Jl. Merjosari No. 45, Malang',
            'price_range' => '10.000 – 25.000',
            'open_hours'  => '06.00 – 14.00',
            'phone'       => '081234567890',
            'whatsapp'    => '6281234567890',
            'is_verified' => true,
            'latitude'    => -7.9392,
            'longitude'   => 112.5965,
        ]);
        if ($warung) $p1->categories()->syncWithoutDetaching([$warung->id]);

        $p2 = Place::firstOrCreate(['name' => 'Kedai Kopi Omah Susu'], [
            'user_id'     => $user2->id,
            'bio'         => 'Kedai kopi cozy dengan konsep rumah vintage.',
            'types'       => ['minum'],
            'lokasi'      => 'dinoyo',
            'address'     => 'Jl. Dinoyo No. 12, Malang',
            'price_range' => '15.000 – 45.000',
            'open_hours'  => '08.00 – 22.00',
            'phone'       => '081398765432',
            'whatsapp'    => '6281398765432',
            'is_verified' => true,
            'latitude'    => -7.9559,
            'longitude'   => 112.6131,
        ]);
        if ($kafe) $p2->categories()->syncWithoutDetaching([$kafe->id]);

        $p3 = Place::firstOrCreate(['name' => 'Boba Frenzy Malang'], [
            'user_id'     => $user1->id,
            'bio'         => 'Boba kekinian dengan topping lengkap!',
            'types'       => ['minum'],
            'lokasi'      => 'watugong',
            'address'     => 'Jl. Watugong Raya No. 23, Malang',
            'price_range' => '12.000 – 30.000',
            'open_hours'  => '10.00 – 21.00',
            'phone'       => '081955554444',
            'whatsapp'    => '6281955554444',
            'is_verified' => true,
            'latitude'    => -7.9421,
            'longitude'   => 112.5987,
        ]);
        if ($boba) $p3->categories()->syncWithoutDetaching([$boba->id]);

        echo "✅ Seeder selesai! Categories, users, dan places berhasil dibuat.\n";
    }
}
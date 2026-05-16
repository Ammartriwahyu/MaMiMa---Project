<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->text('bio')->nullable();

            // types: JSON array ["makan"], ["minum"], or ["makan","minum"]
            $table->json('types');

            // lokasi area
            $table->enum('lokasi', ['merjosari', 'watugong', 'suhat', 'sigura-gura', 'dinoyo']);

            $table->string('address');
            $table->string('price_range', 100)->nullable();
            $table->string('open_hours', 100)->nullable();

            // Contact
            $table->string('phone', 20)->nullable();
            $table->string('whatsapp', 20)->nullable(); // cleaned number e.g. "6281234567890"

            // Media
            $table->string('image')->nullable();

            // Coordinates
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Stats
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('saves_count')->default(0);

            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index('lokasi');
        });
    }

    public function down(): void { Schema::dropIfExists('places'); }
};

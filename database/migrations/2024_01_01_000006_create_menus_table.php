<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('place_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->unsignedInteger('price')->default(0); // in IDR
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // path to uploaded image
            $table->timestamps();

            $table->index('place_id');
        });
    }

    public function down(): void { Schema::dropIfExists('menus'); }
};

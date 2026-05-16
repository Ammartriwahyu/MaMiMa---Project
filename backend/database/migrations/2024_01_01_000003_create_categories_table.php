<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('emoji', 10)->nullable();
            $table->string('color', 50)->nullable(); // Tailwind class e.g. "bg-orange-100 text-orange-700"
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('categories'); }
};

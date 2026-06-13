<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitacion extends Model
{
    protected $table = 'invitaciones';

    protected $fillable = ['email', 'token', 'usado_en'];

    protected function casts(): array
    {
        return ['usado_en' => 'datetime'];
    }

    public function esPendiente(): bool
    {
        return $this->usado_en === null;
    }
}

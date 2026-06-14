<?php

namespace App\Traits;

trait ResuelveActividad
{
    private function resolverTipo(string $nombre): string
    {
        $lower = mb_strtolower($nombre, 'UTF-8');
        return (str_contains($lower, 'yoga') || str_contains($lower, 'basquet') || str_contains($lower, 'deport'))
            ? 'deportiva'
            : 'cultural';
    }
}

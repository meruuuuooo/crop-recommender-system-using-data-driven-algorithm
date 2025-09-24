<?php

namespace App\Repositories;

use App\Models\Farm;

class FarmRepository implements FarmRepositoryInterface
{
    public function all(): array
    {
        return Farm::all()->all();
    }

    public function find(int $id): ?Farm
    {
        return Farm::find($id);
    }

    public function create(array $data): Farm
    {
        return Farm::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $farm = Farm::find($id);
        if (!$farm) {
            return false;
        }
        return $farm->update($data);
    }

    public function delete(int $id): bool
    {
        $farm = Farm::find($id);
        if (!$farm) {
            return false;
        }
        return $farm->delete();
    }
}

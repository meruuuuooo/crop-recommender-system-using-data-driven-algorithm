<?php

namespace App\Repositories;

use App\Models\Farmer;

class FarmerRepository implements FarmerRepositoryInterface
{
    public function all(): array
    {
        return Farmer::all()->all();
    }

    public function find(int $id): ?Farmer
    {
        return Farmer::find($id);
    }

    public function create(array $data): Farmer
    {
        return Farmer::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $farmer = Farmer::find($id);
        if (!$farmer) {
            return false;
        }
        return $farmer->update($data);
    }

    public function delete(int $id): bool
    {
        $farmer = Farmer::find($id);
        if (!$farmer) {
            return false;
        }
        return $farmer->delete();
    }
}

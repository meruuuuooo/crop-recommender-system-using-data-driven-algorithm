<?php

namespace App\Repositories;

use App\Models\Farmer;

interface FarmerRepositoryInterface
{
    /**
     * @return array<int, Farmer>
     */
    public function all(): array;

    public function find(int $id): ?Farmer;

    public function create(array $data): Farmer;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}

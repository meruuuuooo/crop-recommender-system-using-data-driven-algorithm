<?php

namespace App\Repositories;

use App\Models\Farm;

interface FarmRepositoryInterface
{
    /**
     * @return array<int, Farm>
     */
    public function all(): array;

    public function find(int $id): ?Farm;

    public function create(array $data): Farm;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}

# Repository Pattern Documentation

This document explains the implementation of the Repository Pattern in this project.

## What is the Repository Pattern?

The Repository Pattern is a design pattern that mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects. In other words, it abstracts the data layer, so that the rest of the application doesn't need to know how data is stored and retrieved.

## Why use it?

- **Decoupling**: It decouples the data access logic from the business logic. This makes the application more modular and easier to maintain.
- **Testability**: It makes the application easier to test. You can easily swap the actual repository with a mock repository for unit testing.
- **Flexibility**: It allows you to change the data source (e.g., from Eloquent to a different ORM or a NoSQL database) without changing the business logic.
- **Centralized Data Access**: It centralizes data access logic in one place, making it easier to manage and reuse.

## Structure in this project

In this project, the repository pattern is implemented with the following structure:

- **Interfaces**: The repository interfaces are located in the `app/Repositories` directory. These interfaces define the contract that the concrete repositories must implement.
- **Implementations**: The concrete repository implementations are also located in the `app/Repositories` directory. These classes implement the repository interfaces and contain the actual data access logic.

### Example: `FarmerRepository`

- **Interface**: `app/Repositories/FarmerRepositoryInterface.php`

```php
<?php

namespace App\Repositories;

use App\Models\Farmer;

interface FarmerRepositoryInterface
{
    public function all(): array;

    public function find(int $id): ?Farmer;

    public function create(array $data): Farmer;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}
```

- **Implementation**: `app/Repositories/FarmerRepository.php`

```php
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
```

## How to create a new repository

1.  **Create an interface** in the `app/Repositories` directory. This interface should define the methods for your repository.
2.  **Create a class** in the `app/Repositories` directory that implements the interface.
3.  **Implement the methods** in your repository class. Use Eloquent or any other data access logic inside these methods.
4.  **Bind the interface to the implementation** in a service provider (e.g., `AppServiceProvider`).

```php
// app/Providers/AppServiceProvider.php

public function register()
{
    $this->app->bind(
        \App\Repositories\YourRepositoryInterface::class,
        \App\Repositories\YourRepository::class
    );
}
```

5.  **Inject the interface** in your controllers or services where you need to use the repository.

```php
// app/Http/Controllers/YourController.php

use App\Repositories\YourRepositoryInterface;

class YourController extends Controller
{
    private $yourRepository;

    public function __construct(YourRepositoryInterface $yourRepository)
    {
        $this->yourRepository = $yourRepository;
    }

    // ...
}
```

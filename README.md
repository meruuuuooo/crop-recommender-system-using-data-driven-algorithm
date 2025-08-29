# Laravel + React Starter Kit

## Introduction

Our React starter kit provides a robust, modern starting point for building Laravel applications with a React frontend using [Inertia](https://inertiajs.com).

Inertia allows you to build modern, single-page React applications using classic server-side routing and controllers. This lets you enjoy the frontend power of React combined with the incredible backend productivity of Laravel and lightning-fast Vite compilation.

This React starter kit utilizes React 19, TypeScript, Tailwind, and the [shadcn/ui](https://ui.shadcn.com) and [radix-ui](https://www.radix-ui.com) component libraries.

## Getting Started

To get your own copy of this project up and running:

1. **Fork this repository** on GitHub.
2. **Clone your fork** to your local machine:

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-FORK.git
   cd YOUR-FORK
   ```

3. **Install PHP dependencies**:

   ```bash
   composer install
   ```

4. **Install JavaScript dependencies**:

   ```bash
   npm install
   ```

5. **Copy the example environment file and set your environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```

6. **Generate an application key**:

   ```bash
   php artisan key:generate
   ```

7. **Run database migrations and seeders (optional)**:

   ```bash
   php artisan migrate --seed
   ```

8. **Start the development servers**:

   ```bash
   npm run dev
   php artisan serve
   ```

Your application should now be running locally.

## Official Documentation

Documentation for all Laravel starter kits can be found on the [Laravel website](https://laravel.com/docs/starter-kits).

## Contributing

Thank you for considering contributing to our starter kit! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## License

The Laravel + React starter kit is open-sourced software licensed under the MIT license.

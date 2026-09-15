<?php

namespace App\Providers;

use App\Models\Order;
use App\Policies\OrderPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureAuthorization();
        $this->configureDefaults();
        $this->configureErrorPages();
    }

    /**
     * Register application policies and authorization rules.
     */
    protected function configureAuthorization(): void
    {
        Gate::policy(Order::class, OrderPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Render friendly Inertia error pages in production.
     *
     * @see https://inertiajs.com/docs/v3/advanced/error-handling#production
     */
    protected function configureErrorPages(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response): ?ExceptionResponse {
            if (in_array($response->statusCode(), [403, 404, 419, 429, 500, 503], true)) {
                return $response->render('ErrorPage', ['status' => $response->statusCode()]);
            }

            return null;
        });
    }
}

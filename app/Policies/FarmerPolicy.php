<?php

namespace App\Policies;

use App\Models\Farmer;
use App\Models\User;

class FarmerPolicy
{
    /**
     * Determine whether anyone may view farmer profiles.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view a farmer profile.
     */
    public function view(?User $user, Farmer $farmer): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create their own farmer profile.
     */
    public function create(User $user): bool
    {
        return $user->isFarmer() || $user->isAdministrator();
    }

    /**
     * Determine whether the user can update a farmer profile.
     */
    public function update(User $user, Farmer $farmer): bool
    {
        return ($user->isFarmer() && $farmer->user_id === $user->id) || $user->isAdministrator();
    }

    /**
     * Determine whether the user can delete a farmer profile.
     */
    public function delete(User $user, Farmer $farmer): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can approve or reject a farmer application.
     */
    public function approve(User $user, Farmer $farmer): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can suspend an approved farmer.
     */
    public function suspend(User $user, Farmer $farmer): bool
    {
        return $user->isAdministrator();
    }
}

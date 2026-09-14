<?php

namespace App\Services\Ordering\Exceptions;

use RuntimeException;

/**
 * Thrown when a cart line refers to a product that is no longer purchasable.
 */
class UnavailableProductException extends RuntimeException {}

<?php

namespace App\Services\Ordering\Exceptions;

use RuntimeException;

/**
 * Thrown when checkout is attempted with an empty cart.
 */
class EmptyCartException extends RuntimeException {}

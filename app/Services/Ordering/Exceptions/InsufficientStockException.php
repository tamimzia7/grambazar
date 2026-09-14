<?php

namespace App\Services\Ordering\Exceptions;

use RuntimeException;

/**
 * Thrown when a cart line needs more stock than is available.
 */
class InsufficientStockException extends RuntimeException {}

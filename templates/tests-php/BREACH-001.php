<?php

namespace Compliance\Tests;

use PHPUnit\Framework\TestCase;

class DataRetentionTest extends TestCase
{
    public function testEnforceDataRetentionPolicy(): void
    {
        $config = Config::load();
        $retention = $config->dataLifecycle->retention;
        $this->assertGreaterThan(0, $retention);
        $this->assertLessThanOrEqual(365, $retention);
    }
}
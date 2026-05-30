<?php

namespace Compliance\Tests;

use PHPUnit\Framework\TestCase;

class DataResidencyTest extends TestCase
{
    public function testRejectForeignDataResidency(): void
    {
        $config = Config::load();
        $residency = $config->infrastructure->dataResidency;
        $this->assertContains($residency, ['Local', 'Hybrid']);
    }
}
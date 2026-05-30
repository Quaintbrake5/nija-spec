<?php

namespace Compliance\Tests;

use PHPUnit\Framework\TestCase;

class SecurityClassificationTest extends TestCase
{
    public function testVerifySecurityClassification(): void
    {
        $config = Config::load();
        $this->assertNotEmpty($config->auditMetadata->classification);
    }
}
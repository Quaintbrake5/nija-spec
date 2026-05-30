<?php

namespace Compliance\Tests;

use PHPUnit\Framework\TestCase;

class TLSVersionTest extends TestCase
{
    public function testEnforceTLSVersion(): void
    {
        $config = Config::load();
        $tls = $config->authentication->tlsVersion;
        $this->assertContains($tls, ['1.2', '1.3']);
    }
}
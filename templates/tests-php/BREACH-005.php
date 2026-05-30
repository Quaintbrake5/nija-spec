<?php

namespace Compliance\Tests;

use PHPUnit\Framework\TestCase;

class MFATest extends TestCase
{
    public function testVerifyMFAEnabled(): void
    {
        $config = Config::load();
        $this->assertEquals('Enabled', $config->authentication->mfa);
    }
}
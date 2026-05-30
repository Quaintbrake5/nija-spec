<?php

namespace Compliance\Tests;

use PHPUnit\Framework\TestCase;

class PIICategoriesTest extends TestCase
{
    public function testVerifyPIICategoriesDocumented(): void
    {
        $config = Config::load();
        $this->assertNotEmpty($config->dataLifecycle->piiCategories);
    }
}
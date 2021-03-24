<?php

// 登陆认证;
include('../../../app/api/KodSSO.class.php');
KodSSO::check('webConsole');

$NO_LOGIN = true;
include('./webconsole.php.txt');
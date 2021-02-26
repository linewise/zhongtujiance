<?php

namespace app\site1\controller;

use app\common\controller\Frontend;

class Contact extends Frontend
{

    protected $layout = 'default';
    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';

    public function index()
    {
        return $this->view->fetch();
    }

}

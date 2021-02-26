<?php

namespace app\index\controller\site1;

use app\common\controller\Frontend;

class Industry extends Frontend
{

    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';

    public function index()
    {
        return $this->view->fetch();
    }

}

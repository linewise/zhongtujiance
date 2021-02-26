<?php

namespace app\index\controller\site1;

use app\common\controller\Frontend;

class Index extends Frontend
{

    protected $layout = 'default';
    protected $noNeedLogin = [];
    protected $noNeedRight = ['*'];

    public function index()
    {


        return $this->view->fetch();
    }

}

<?php

namespace app\site1\controller;

use app\common\controller\Frontend;

class Industry extends Frontend
{

    protected $layout = 'default';
    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\cms\Archives;
    }

    public function index()
    {
        $list = $this->model
            ->with('channel')
            ->where(['archives.channel_id'=>5])
            ->select();
        foreach($list as $v){
            $v->imgs = explode(',',$v->image);
        }
        $this->view->assign('list', $list);
        return $this->view->fetch();
    }

}

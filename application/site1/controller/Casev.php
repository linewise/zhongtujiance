<?php

namespace app\site1\controller;

use app\common\controller\Frontend;
use think\Db;

class Casev extends Frontend
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
            ->with('Channel')
            ->where(['Archives.channel_id'=>9])
            ->paginate(10);
        foreach($list as $v){
            $v->imgs = explode(',',$v->image);
            $v->time = date('Y-m-d',$v->createtime);
        }
        $this->view->assign('list', $list);
        $this->view->assign('page', $list->render());
        return $this->view->fetch();
    }

}

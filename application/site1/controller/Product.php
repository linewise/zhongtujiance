<?php

namespace app\site1\controller;

use app\common\controller\Frontend;
use think\Db;

class Product extends Frontend
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
        $ids = $this->request->param('id')?$this->request->param('id'):7;
        $list = $this->model
            ->with('channel')
            ->where(['archives.channel_id'=>$ids])
            ->paginate(10);
        foreach($list as $v){
            $v->imgs = explode(',',$v->image);
        }
        $tlist = Db::name('cms_channel')->where(['parent_id'=>6])->select();
        $this->view->assign('tlist', $tlist);
        $this->view->assign('list', $list);
        $this->view->assign('page', $list->render());
        $this->view->assign('id', $ids);
        return $this->view->fetch();
    }

}

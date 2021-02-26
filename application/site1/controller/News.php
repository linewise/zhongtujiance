<?php

namespace app\site1\controller;

use app\common\controller\Frontend;
use think\Db;

class News extends Frontend
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
        
        $ids = $this->request->param('id')?$this->request->param('id'):11;
        
        $list = $this->model
            ->with('channel')
            ->where(['archives.channel_id'=>$ids])
            ->paginate(10);
        foreach($list as $v){
            $v->imgs = explode(',',$v->image);
            $v->time = date('Y-m-d',$v->createtime);
        }

        $tlist = Db::name('cms_channel')->where(['parent_id'=>10])->select();
        $this->view->assign('tlist', $tlist);
        $this->view->assign('list', $list);
        $this->view->assign('page', $list->render());
        $this->view->assign('id', $ids);
        return $this->view->fetch();
    }

    public function show(){
        $ids = $this->request->param('id');
        
        if(empty($ids)){
            die('id不存在');
        }
        $info = $this->model
            ->where(['id'=>$ids])
            ->find();
        $info['imgs'] = explode(',',$info['image']);
        $info['time'] = date('Y-m-d',$info['createtime']);
        $this->view->assign('info', $info);

        $idsw = $this->model->where('channel_id',$info['channel_id'])->column('id');

        foreach ($idsw as $k => $v) {
            if($ids==$idsw[$k]){
                //定位当篇
                //获取下一篇
                if(isset($idsw[$k+1])){
                    $next_id = $idsw[$k+1];
                }else{
                    $next_id = '';
                }
                //获取上一篇
                if(isset($idsw[$k-1])){
                    $pre_id = $idsw[$k-1];
                }else{
                    $pre_id = '';
                }
            }
        }
        if($next_id != ''){
            $next_artilce =$this->model->where('id',$next_id)->field('id,title')->find();
        }else{
            $next_artilce = '';
        }
        if($pre_id !=''){
            $pre_article = $this->model->where('id',$pre_id)->field('id,title')->find();
        }else{
            $pre_article = '';
        }
        $this->view->assign('next_artilce', $next_artilce);
        $this->view->assign('pre_article', $pre_article);

        return $this->view->fetch();
    }

}

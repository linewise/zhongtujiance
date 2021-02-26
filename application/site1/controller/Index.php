<?php

namespace app\site1\controller;

use app\common\controller\Frontend;
use think\Config;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;

class Index extends Frontend
{

    protected $layout = 'default';
    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('CmsMessage');
    }

    public function index()
    {

        $model = new \app\admin\model\cms\Archives;
        $list = $model
            ->with('channel')
            ->where(['channel.admin_id'=>ADMIN_ID])
            ->order('id desc')
            ->paginate(4);
        foreach ($list as $row) {
            $row->visible(['id','title']);
            $row->day = date('d',$row->createtime);
            $row->yar = date('Y-m',$row->createtime);
        }
        $this->assign('news',$list);
        return $this->view->fetch();
    }

    /**
     * 留言
     */
    public function sendmsg(){
        if ($this->request->isPost()) {
            $params = $this->request->post("");
            if ($params) {
                $params = $this->preExcludeFields($params);

                if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                    $params[$this->dataLimitField] = $this->auth->id;
                }
                if(empty($params['name']) || empty($params['telephone']) || empty($params['content'])){
                    $this->error(__('请补全信息', ''));
                }
                $a_info = Db::name('admin')->field('id')->where(['username'=>$this->request->module()])->find();
                $params['admin_id'] = $a_info['id'];
                $params['createtime'] = time();;
                $result = $this->model->insert($params);

                if ($result !== false) {
                    $this->success(__('留言成功'));
                } else {
                    $this->error(__('留言失败'));
                }
            }
            $this->error(__('请求参数不能为空', ''));
        }else{
            $this->error(__('请求错误', ''));
        }
    }

}

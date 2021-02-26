<?php

namespace app\admin\model;

use think\Model;


class SiteData extends Model
{

    

    

    // 表名
    protected $name = 'site_data';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    







    public function site()
    {
        return $this->belongsTo('Site', 'site_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}

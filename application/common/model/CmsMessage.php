<?php

namespace app\common\model;

use think\Model;


class CmsMessage extends Model
{

    

    

    // 表名
    protected $name = 'cms_message';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    







}

define([], function () {
    require.config({
    paths: {
        'jquery-colorpicker': '../addons/cms/js/jquery.colorpicker.min',
        'jquery-autocomplete': '../addons/cms/js/jquery.autocomplete',
        'jquery-tagsinput': '../addons/cms/js/jquery.tagsinput',
    },
    shim: {
        'jquery-colorpicker': {
            deps: ['jquery'],
            exports: '$.fn.extend'
        },
        'jquery-autocomplete': {
            deps: ['jquery'],
            exports: '$.fn.extend'
        },
        'jquery-tagsinput': {
            deps: ['jquery', 'jquery-autocomplete', 'css!../addons/cms/css/jquery.tagsinput.min.css'],
            exports: '$.fn.extend'
        }
    }
});
require.config({
    paths: {
        'geetest': '../addons/geetest/js/geetest.min'
    }
});

require(['geetest'], function (Geet) {
    var geetInit = false;
    window.renderGeetest = function () {
        $("input[name='captcha']:visible").each(function () {
            var obj = $(this);
            var form = obj.closest('form');
            obj.parent()
                .removeClass('input-group')
                .html('<div class="embed-captcha"><input type="hidden" name="captcha" class="form-control" data-msg-required="请完成验证码验证" data-rule="required" /> </div> <p class="wait show" style="min-height:44px;line-height:44px;">正在加载验证码...</p>');

            Fast.api.ajax("/addons/geetest/index/start", function (data) {
                // 参数1：配置参数
                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                initGeetest({
                    gt: data.gt,
                    https: true,
                    challenge: data.challenge,
                    new_captcha: data.new_captcha,
                    product: Config.geetest.product, // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                    width: '100%',
                    offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                }, function (captchaObj) {
                    // 将验证码加到id为captcha的元素里，同时会有三个input的值：geetest_challenge, geetest_validate, geetest_seccode
                    geetInit = captchaObj;
                    captchaObj.appendTo($(".embed-captcha", form));
                    captchaObj.onReady(function () {
                        $(".wait", form).remove();
                    });
                    captchaObj.onSuccess(function () {
                        var result = captchaObj.getValidate();
                        if (result) {
                            $('input[name="captcha"]', form).val('ok');
                        }
                    });
                    captchaObj.onError(function () {
                        geetInit.reset();
                    });
                });
                // 监听表单错误事件
                form.on("error.form", function (e, data) {
                    geetInit.reset();
                });
                return false;
            });
        });
    };
    renderGeetest();
});

require.config({
    paths: {
        'nkeditor': '../addons/nkeditor/js/customplugin',
        'nkeditor-core': '../addons/nkeditor/nkeditor.min',
        'nkeditor-lang': '../addons/nkeditor/lang/zh-CN',
    },
    shim: {
        'nkeditor': {
            deps: [
                'nkeditor-core',
                'nkeditor-lang'
            ]
        },
        'nkeditor-core': {
            deps: [
                'css!../addons/nkeditor/themes/black/editor.min.css',
                'css!../addons/nkeditor/css/common.css'
            ],
            exports: 'window.KindEditor'
        },
        'nkeditor-lang': {
            deps: [
                'nkeditor-core'
            ]
        }
    }
});
require(['form'], function (Form) {
    var _bindevent = Form.events.bindevent;
    Form.events.bindevent = function (form) {
        _bindevent.apply(this, [form]);
        if ($(".editor", form).size() > 0) {
            require(['nkeditor', 'upload'], function (Nkeditor, Upload) {
                var getImageFromClipboard, getImageFromDrop, getFileFromBase64;
                getImageFromClipboard = function (data) {
                    var i, item;
                    i = 0;
                    while (i < data.clipboardData.items.length) {
                        item = data.clipboardData.items[i];
                        if (item.type.indexOf("image") !== -1) {
                            return item.getAsFile() || false;
                        }
                        i++;
                    }
                    return false;
                };
                getImageFromDrop = function (data) {
                    var i, item, images;
                    i = 0;
                    images = [];
                    while (i < data.dataTransfer.files.length) {
                        item = data.dataTransfer.files[i];
                        if (item.type.indexOf("image") !== -1) {
                            images.push(item);
                        }
                        i++;
                    }
                    return images;
                };
                getFileFromBase64 = function (data, url) {
                    var arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    var filename, suffix;
                    if (typeof url != 'undefined') {
                        var urlArr = url.split('.');
                        filename = url.substr(url.lastIndexOf('/') + 1);
                        suffix = urlArr.pop();
                    } else {
                        filename = Math.random().toString(36).substring(5, 15);
                    }
                    console.log(filename);
                    if (!suffix) {
                        suffix = data.substring("data:image/".length, data.indexOf(";base64"));
                    }

                    var exp = new RegExp("\\." + suffix + "$", "i");
                    filename = exp.test(filename) ? filename : filename + "." + suffix;
                    var file = new File([u8arr], filename, {type: mime});
                    return file;
                };

                var getImageFromUrl = function (url, callback, outputFormat) {
                    var canvas = document.createElement('CANVAS'),
                        ctx = canvas.getContext('2d'),
                        img = new Image;
                    img.crossOrigin = 'Anonymous';
                    img.onload = function () {
                        var urlArr = url.split('.');
                        var suffix = urlArr.pop();
                        suffix = suffix.match(/^(jpg|png|gif|bmp|jpeg)$/i) ? suffix : 'png';

                        try {
                            canvas.height = img.height;
                            canvas.width = img.width;
                            ctx.drawImage(img, 0, 0);
                            var dataURL = canvas.toDataURL(outputFormat || 'image/' + suffix);
                            var file = getFileFromBase64(dataURL, url);
                        } catch (e) {
                            callback.call(this, null);
                        }

                        callback.call(this, file);
                        canvas = null;
                    };
                    img.onerror = function (e) {
                        callback.call(this, null);
                    };
                    img.src = url;
                };
                //上传Word图片
                Nkeditor.uploadwordimage = function (index, image) {
                    var that = this;
                    (function () {
                        var file = getFileFromBase64(image);
                        var placeholder = new RegExp("##" + index + "##", "g");
                        Upload.api.send(file, function (data) {
                            that.html(that.html().replace(placeholder, Fast.api.cdnurl(data.url)));
                        }, function (data) {
                            that.html(that.html().replace(placeholder, ""));
                        });
                    }(index, image));
                };

                Nkeditor.lang({
                    remoteimage: '下载远程图片'
                });
                //远程下载图片
                Nkeditor.plugin('remoteimage', function (K) {
                    var editor = this, name = 'remoteimage';
                    editor.plugin.remoteimage = {
                        download: function (e) {
                            var that = this;
                            var html = that.html();
                            var staging = {}, orgined = {}, index = 0, images = 0, completed = 0, failured = 0;
                            var checkrestore = function () {
                                if (completed + failured >= images) {
                                    $.each(staging, function (i, j) {
                                        that.html(that.html().replace("<code>" + i + "</code>", j));
                                    });
                                }
                            };
                            html.replace(/<code>([\s\S]*?)<\/code>/g, function (code) {
                                    staging[index] = code;
                                    return "<code>" + index + "</code>";
                                }
                            );
                            html = html.replace(/<img([\s\S]*?)\ssrc\s*=\s*('|")((http(s?):)([\s\S]*?))('|")([\s\S]*?)[\/]?>/g, function () {
                                images++;
                                var url = arguments[3];
                                var placeholder = '<img src="' + Fast.api.cdnurl("/assets/addons/nkeditor/img/downloading.png") + '" data-index="' + index + '" />';
                                //如果是云存储的链接,则忽略
                                if (Config.upload.cdnurl && url.indexOf(Config.upload.cdnurl) > -1) {
                                    completed++;
                                    return arguments[0];
                                } else {
                                    orgined[index] = arguments[0];
                                }
                                //下载远程图片
                                (function (index, url, placeholder) {
                                    getImageFromUrl(url, function (file) {
                                        if (!file) {
                                            failured++;
                                            that.html(that.html().replace(placeholder, orgined[index]));
                                            checkrestore();
                                        } else {
                                            Upload.api.send(file, function (data) {
                                                completed++;
                                                that.html(that.html().replace(placeholder, '<img src="' + Fast.api.cdnurl(data.url) + '" />'));
                                                checkrestore();
                                            }, function (data) {
                                                failured++;
                                                that.html(that.html().replace(placeholder, orgined[index]));
                                                checkrestore();
                                            });
                                        }
                                    });
                                })(index, url, placeholder);
                                index++;
                                return placeholder;
                            });
                            if (index > 0) {
                                that.html(html);
                            } else {
                                Toastr.info("没有需要下载的远程图片");
                            }
                        }
                    };
                    // 点击图标时执行
                    editor.clickToolbar(name, editor.plugin.remoteimage.download);
                });

                $(".editor", form).each(function () {
                    var that = this;
                    Nkeditor.create(that, {
                        width: '100%',
                        filterMode: false,
                        wellFormatMode: false,
                        allowMediaUpload: true, //是否允许媒体上传
                        allowFileManager: true,
                        allowImageUpload: true,
                        wordImageServer: typeof Config.nkeditor != 'undefined' && Config.nkeditor.wordimageserver ? "127.0.0.1:10101" : "", //word图片替换服务器的IP和端口
                        urlType: Config.upload.cdnurl ? 'domain' : '',//给图片加前缀
                        cssPath: Fast.api.cdnurl('/assets/addons/nkeditor/plugins/code/prism.css'),
                        cssData: "body {font-size: 13px}",
                        fillDescAfterUploadImage: false, //是否在上传后继续添加描述信息
                        themeType: typeof Config.nkeditor != 'undefined' ? Config.nkeditor.theme : 'black', //编辑器皮肤,这个值从后台获取
                        fileManagerJson: Fast.api.fixurl("/addons/nkeditor/index/attachment/module/" + Config.modulename),
                        items: [
                            'source', 'undo', 'redo', 'preview', 'print', 'template', 'code', 'quote', 'cut', 'copy', 'paste',
                            'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter', 'justifyright',
                            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                            'superscript', 'clearhtml', 'quickformat', 'selectall',
                            'formatblock', 'fontname', 'fontsize', 'forecolor', 'hilitecolor', 'bold',
                            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', 'image', 'multiimage', 'graft',
                            'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
                            'anchor', 'link', 'unlink', 'remoteimage', 'about', 'fullscreen'
                        ],
                        afterCreate: function () {
                            var self = this;
                            //Ctrl+回车提交
                            Nkeditor.ctrl(document, 13, function () {
                                self.sync();
                                $(that).closest("form").submit();
                            });
                            Nkeditor.ctrl(self.edit.doc, 13, function () {
                                self.sync();
                                $(that).closest("form").submit();
                            });
                            //粘贴上传
                            $("body", self.edit.doc).bind('paste', function (event) {
                                var image, pasteEvent;
                                pasteEvent = event.originalEvent;
                                if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
                                    image = getImageFromClipboard(pasteEvent);
                                    if (image) {
                                        event.preventDefault();
                                        Upload.api.send(image, function (data) {
                                            self.exec("insertimage", Fast.api.cdnurl(data.url));
                                        });
                                    }
                                }
                            });
                            //挺拽上传
                            $("body", self.edit.doc).bind('drop', function (event) {
                                var image, pasteEvent;
                                pasteEvent = event.originalEvent;
                                if (pasteEvent.dataTransfer && pasteEvent.dataTransfer.files) {
                                    images = getImageFromDrop(pasteEvent);
                                    if (images.length > 0) {
                                        event.preventDefault();
                                        $.each(images, function (i, image) {
                                            Upload.api.send(image, function (data) {
                                                self.exec("insertimage", Fast.api.cdnurl(data.url));
                                            });
                                        });
                                    }
                                }
                            });
                        },
                        //FastAdmin自定义处理
                        beforeUpload: function (callback, file) {
                            var file = file ? file : $("input.ke-upload-file", this.form).prop('files')[0];
                            Upload.api.send(file, function (data) {
                                var data = {code: '000', data: {url: Fast.api.cdnurl(data.url)}, title: '', width: '', height: '', border: '', align: ''};
                                callback(data);
                            });

                        },
                        //错误处理 handler
                        errorMsgHandler: function (message, type) {
                            try {
                                console.log(message, type);
                            } catch (Error) {
                                alert(message);
                            }
                        }
                    });
                });
            });
        }
    }
});

});
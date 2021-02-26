function wp_getdefaultHoverCss(layer_id)
{
	var getli='';
	var geta='';
	var cssstyle='';

	var navStyle = wp_get_navstyle(layer_id,'datasty_');
	if(navStyle.length > 0)
	{
		var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
		var tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp1 = tmp[0].match(/{[^}]+}/)[0];
			tmp1=tmp1.replace('{','').replace('}','');
			getli=getli+tmp1;
		}
 
		patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
		tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp2 = tmp[0].match(/{[^}]+}/)[0];
			tmp2=tmp2.replace('{','').replace('}','');
			geta=geta+tmp2;
		}		
		
		
	}

	navStyle = wp_get_navstyle(layer_id,'datastys_');
	var getlia='';
	if(navStyle.length > 0)
	{		 
		var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestr='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestr=combilestr+ervervalue;
			}
			geta=geta+combilestr;
		}
		
		layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestrs='';
			for(var key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestrs=combilestrs+ervervalue;
			}
			getli=getli+combilestrs;
		}
	 
		
	}

	if(getli.length>0){
		getli="#"+layer_id+" li.lihover{"+getli+"} ";
	}
	if(geta.length>0){
		geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
	}
	cssstyle=getli+geta;
	if(cssstyle.length>0 && ($('#canvas #'+layer_id).length>0 || $('#site_footer #'+layer_id).length>0)){
		cssstyle=""+cssstyle+"";
		cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		var doms=$('#'+layer_id);
		var oldcssstyle=doms.data('get_layer_hover_css');
		if(oldcssstyle != cssstyle){
			$("#hover"+layer_id+"").text(""+cssstyle+"");
			doms.data('get_layer_hover_css',cssstyle);
			get_plugin_css("H"+ layer_id +"H",cssstyle);
		}
	}
}

function wp_showdefaultHoverCss(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
		return window['wp_showdefaultHoverCss_'+layertype](layer_id);
	}
	return false;
}

function wp_showdefaultHoverCss_new_navigation(layer_id)
{
	 
	var plugin_name=$("#"+layer_id).attr('type');
	var hover=$("#"+layer_id).find('.nav1').attr('hover');
	if(hover!=1){ return;}
	
	wp_getdefaultHoverCss(layer_id);
	var n=0;
	var rootpid=0;
	if(plugin_name=='new_navigation'){
		var page_id=$("#page_id").val();
		rootpid=$("#page_id").attr("rpid")*1;
	}else{
		var page_id=$('#'+layer_id+'').find(".default_pid").html();
		if(page_id==0 || page_id.length==0){
			page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');	
		}
	}

	$('#nav_'+layer_id+'').children('li').each(function(){
		var type_pid=$(this).attr('pid');
		if( (type_pid==page_id ) && plugin_name=='new_navigation' ){
			$(this).addClass("lihover").children('a').addClass("ahover");
		}
		if(type_pid==rootpid && rootpid>0){
			$(this).addClass('rootlihover');
		}
		var t_bool = false;
		var whref = window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');;
		var t_href= $(this).find("a").attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');;
 		var $nav1 =  $('#'+layer_id).children('.wp-new_navigation_content').children('.nav1');
		var sethomeurl = $nav1.attr("sethomeurl");
		if(sethomeurl) sethomeurl = sethomeurl.replace(/^https?:/,'');
		var cururl = window.location.href.replace(/^https?:/,'');
		if( (whref.indexOf("&menu_id=")>0 && t_href.indexOf("id=")>0 && whref.indexOf(t_href)>-1) || t_href == sethomeurl &&  sethomeurl.indexOf(cururl)>-1 ){
			t_bool = true;
		}

		if(whref == t_href || whref== t_href+"&brd=1" || t_bool){ $(this).addClass("lihover").children('a').addClass("ahover"); }
		n++;
	});
	if(!$('#nav_'+layer_id+'').children('li.lihover').length){
		$('#nav_'+layer_id+'').children('li.rootlihover:first').addClass("lihover").children('a').addClass("ahover");
	}
	$('#nav_'+layer_id+' .rootlihover').removeClass('rootlihover');
}
function wp_nav_addMoreButton(layer_id)
{  
	var type_style=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
	
	var index=0;
	var func=function(){
		if(!$('#scroll_container #'+layer_id+':visible').length){
			if(index<=20){
				setTimeout(func,500);
				index++;
			}
			return;
		}

		var firstLiTop = 0;
		var hasMore = false;
		$('#scroll_container  #nav_'+layer_id).children('li.wp_subtop').each(function(i){
			if(i == 0) {firstLiTop = $(this).offset().top;return true;}	
			if($(this).offset().top > firstLiTop)
			{
				if(i==1){
					var twice=$("#"+layer_id).data('twiced');
					if(!twice){
						$("#"+layer_id).data('twiced',true);
						setTimeout(func,1500);
						return false;
					}
				}	

				if(type_style==2){
					$(this).remove();
				}else{

				$('#'+layer_id).data('hasMore','yes');//配置逻辑获取
				var more = $.trim($('#'+layer_id).children('.wp-new_navigation_content').children('.nav1').attr('more'));
				var doms = $(this).prev().prev().nextAll().clone();
				var objA = $(this).prev().children('a');
				if(objA.children('span').length > 0) objA.children('span').html(more);
				else objA.html(more);

				if(objA.hasClass('sub'))
				{
					objA.next('ul').empty();
					doms.appendTo(objA.next('ul'));
				}
				else
				{
					objA.after('<ul></ul>');
					doms.appendTo(objA.next('ul'));
					objA.addClass('sub');
				}
				objA.addClass('nav_more_link');
				$(this).prev().nextAll().remove();
				objA.next('ul').children('li').removeClass('wp_subtop').removeClass('lihover').children('a').removeClass("ahover");
				hasMore = true;
				
				objA.attr('href','javascript:void(0);');

				//点击"更多"弹出全站导航
				if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
				{
					$(document).undelegate("#"+layer_id+" .nav_more_link",'click').delegate("#"+layer_id+" .nav_more_link",'click',function (e){
						var func=function(){
							$('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
								containerId:'wp-new_navigation-simplemodal-container_'+layer_id,
								zIndex:9999,
								close:false,
								onOpen:function(dialog){
									dialog.overlay.fadeIn('slow', function(){
										dialog.container.slideDown('slow',function(){
											dialog.data.fadeIn('slow','swing',function(){
												$('.wp_menus').not('.wp_thirdmenu0').each(function(){
													var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
													$(this).css({position:'relative',left:left+'px'});
												});
											});
										});
									});
								},
								onClose:function(dialog){
									dialog.data.fadeOut('slow',function (){
										dialog.container.slideUp('slow', function () {
											dialog.overlay.fadeOut('slow', function () {
												$.modal.close();
											});
										});
									});
								}
							});
						}
						if($('#'+layer_id).find('#basic-modal-content_'+layer_id).length){
							func();
						}else{
							var morediv=$('#'+layer_id).find('.navigation_more');
							var more_color=morediv.attr('data-more');
							var typeval=morediv.attr('data-typeval');
							var menudata=morediv.attr('data-menudata');
							$.ajax({
								type: "POST",
								url: parseToURL("new_navigation", "windowpopup"),
								data: {layer_id:layer_id,color:more_color,typeval:typeval,menudata:menudata},
								success: function (response) {
									if (response == 'Session expired')
										window.location.href = getSessionExpiredUrl();
									morediv.replaceWith(response);
									func();
								},
								error: function (xhr, textStatus, errorThrown) {
									wp_alert(xhr.readyState + ',' + xhr.status + ' - ' + (errorThrown || textStatus) + "(get nav).<br/>" + translate("Request failed!"));
									return false;
								}
							});
						}
						return false;
					});
				
				}
				return false;
				}
			}
		});
		if(!hasMore) $('#'+layer_id).data('hasMore','no');
		wp_showdefaultHoverCss(layer_id);
	};
	func();
}

//编辑模式水平拖动动态刷新修改More按钮
function wp_updateMoreButton(layer_id)
{
	var $layer = $('#'+layer_id);
	var $nav1 = $layer.children('.wp-new_navigation_content').children('.nav1');
	var tmp_css = $.trim($("#datastys_"+layer_id).text());
	var tmp_cssa = $.trim($("#datasty_"+layer_id).text()); 
	$.post(parseToURL("new_navigation","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-new_navigation_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),hover_scr:$.trim($nav1.attr('hover_scr')),umenu:$.trim($nav1.attr('umenu')),dmenu:$.trim($nav1.attr('dmenu')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),{"addopts": $layer.mod_property("addopts")||{},menudata:$("#"+layer_id).data("menudata")},function(data){
		$layer.find('.wp-new_navigation_content').html(data);		
		$("#datastys_"+layer_id).text(tmp_css);
		get_plugin_css(layer_id,tmp_cssa+" "+tmp_css);
	});
	wp_showdefaultHoverCss(layer_id);
}

function wp_removeLoading(layer_id)
{
	
	var $nav1 = $('#'+layer_id).find(".nav1");
	var ishorizon=$nav1.attr("ishorizon");
	if(ishorizon=='1'){
		$("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
	}else{
		$("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
	}
	// 修复IE浏览器部分版本导航无法显示问题 2013/12/26
 
	var temptimer = setTimeout(function(){
		$("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
		clearTimeout(temptimer);
	}, 50);
}

function richtxt(layer_id)
{
	var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
	if(type==2){
		var baseloop = 0;
		 $("#"+layer_id).find('.ddli').each(function(){
			 $(this).addClass("setdiff"+baseloop);
			 baseloop++;
		 });
	}
}

function wp_createNavigationgetSubMenuHoverCssFunc(param){
	var layer_id=param.layer_id;
	var editmode=param.editmode;
	function getSubMenuHoverCss(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		if(editmode){
			var navStyle = $.trim($("#datastys_"+layer_id).text());
		}else{
			var navStyle = $.trim($("#"+layer_id).data("datastys_"));
		}
		if(navStyle.length > 0){
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		if(editmode){
			navStyle = $.trim($("#datasty_"+layer_id).text());
		}else{
			navStyle = $.trim($("#"+layer_id).data("datasty_"));
		}
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);

			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}
		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	}
	window[layer_id+'_getSubMenuHoverCss']=getSubMenuHoverCss;
}

function layer_new_navigation_content_func(params){
	var layer_id = params['layer_id'];
	$("#"+layer_id).find('.menu_hs11').css('visibility','hidden');
    var contentfunc=function(){
        if($("#"+layer_id).is(':visible')){
                $("#"+layer_id).find('.wp-new_navigation_content').each(function(){
                  var wid = $(this).width();
                  var liwid = $(this).find('li:eq(0)');
				  var lipadd = parseInt(liwid.css('padding-right'))+parseInt(liwid.css('padding-left'));
				  var isEmptyMenu=false;
				  if($(this).find('li.wp_subtop').length==1){
					  var menulinktxt=$(this).find('li.wp_subtop a').text();
					  if(menulinktxt=='No menu!'){
						 isEmptyMenu=true;
					  }
				  }
                  if (!isEmptyMenu && $.inArray(params.menustyle, ['hs7','hs9','hs11','hs12']) != -1) {
					  var bwidth = parseFloat(liwid.css("borderRightWidth") || '0');
					  if(bwidth>0) bwidth=parseInt(bwidth + 0.1);
					  else bwidth =0;
					  if(bwidth > 0) $('li.wp_subtop', this).width(function(i, h){return h - bwidth - 1});
					  else if(!$("#canvas").data('changewidth_'+layer_id)){
						  $("#canvas").data('changewidth_'+layer_id,true);
						  if(params.menustyle=='hs12'){
						  	$('li.wp_subtop', this).width(function(i, h){return h - 1})
						  }else{
							var totalw=0;
							$('li.wp_subtop', this).width(function(i, h){totalw+=h;return h})
							var ulwidth=$(this).find('#nav_'+layer_id).width();
							if(totalw>ulwidth){
								for(var i=0;i<totalw-ulwidth;i++){
								 	$('li.wp_subtop:eq('+i+')', this).width(function(i, h){return h - 1});
								}
							}
						  }
					  };
				  }
                  if(parseInt(liwid.width())>(wid-lipadd)){
					$(this).find('li.wp_subtop').css('width',wid-lipadd);
                  }
                });
                $("#"+layer_id).find('.menu_hs11,.menu_hs7,.menu_hs12').css('visibility','');
                var contenth=$("#"+layer_id+" .wp-new_navigation_content").height();
                if(contenth==0){
                    $("#"+layer_id+" .wp-new_navigation_content").css('height','');
                }
         }else{
                 setTimeout(contentfunc,60);
         }
    }
	contentfunc();
		if(params.isedit){$('#'+layer_id).mod_property({"addopts": params.addopts});}
	if((params.addopts||[]).length > 0 && /^hs/i.test(params.menustyle)){$('#nav_'+layer_id+' li.wp_subtop:last').css("border-right", 'none');}
    if(! params.isedit){
        if($.inArray(params.menustyle, ['vertical_vs6','vertical_vs7']) != -1){
            var $layer=$('#'+layer_id).find(".wp-new_navigation_content");
            var vswidth=$layer.width();
            var $ul=$layer.find('ul.navigation');
            $ul.css({width:vswidth+'px'});
            $ul.find("li.wp_subtop").css({width:(vswidth-14)+'px'});
        }
    }
};
function layer_new_navigation_hs9_func(params){
	var layer_id = params['layer_id'],
	menustyle = params.menustyle;
	window[layer_id+'_liHoverCallBack'] = function(){
		$(".menu_"+menustyle+" #nav_"+layer_id+" li").hover(function(){
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);
				var canvas_zindex = $('#canvas').css('z-index');
				var $toolbar = $(".propblk[super='"+layer_id+"']");
				if($toolbar.length > 0)  $toolbar.css('z-index',canvas_zindex - 1);
			}
			$(this).children("ul").css("left", "0px").show();
		},function(){
			$(this).children("ul").hide();

			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				var isHover = true;
				$('#nav_'+layer_id).find('ul').each(function(){
					if($(this).css('display') != 'none') isHover = false;
					return false;
				});
				if(isHover){
					if(!($.browser.msie && $.browser.version < 9)) $(this).parent().css('z-index',resizehandle-1);
				}				
			}

		});

	};
	
	window[layer_id+'_getSubMenuHoverCss'] = function(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 2){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 3){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		
		var navStyle = wp_get_navstyle(layer_id, 'datastys_');
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		navStyle = wp_get_navstyle(layer_id, 'datasty_');
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else if(typeval == 2){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{[^}]+}",'i');
			}else if(typeval == 3){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	};
	
	$('#'+layer_id).layer_ready(function(){
		window[layer_id+'_liHoverCallBack']();

		//第三级即下级菜单随高度增加位置动态修改
		$('#'+layer_id+' .menu_'+menustyle+' li').hover(function(){
			$(this).children('ul').css('top',$(this).outerHeight());
		});
		
		$("#"+layer_id+" li").hover(function(){ 			
				var thisleft=$(this).offset().left;
				var thiswidth=$(this).outerWidth();	
				//父中心点坐标
				var thiswidthcenter=0;
				//子中心点坐标
				var thischildwidthcenter=0;			
				var orgleft = $("#"+layer_id).offset().left;
				var orgright = $("#"+layer_id).outerWidth();
				orgright=orgright+orgleft;
				thiswidthcenter=thisleft+thiswidth/2;

				//计算子菜单总宽度
				var childlidom=$(this).children('ul').children('li');
				var childliwidth=0;
				childlidom.each(function(){
					childliwidth=childliwidth+$(this).outerWidth();			
				});
				
				thischildwidthcenter=childliwidth/2;			
				var chavalue=thiswidthcenter-thischildwidthcenter;
				var charightvalue=thiswidthcenter+thischildwidthcenter;			
				
				var ulwidth=$("#"+layer_id).width();
				if(chavalue<orgleft && charightvalue>orgright){ 
					//超出边界不做处理			
				}else{
					if(chavalue>orgleft && charightvalue<orgright){
						$(this).children("ul:eq(0)").css("padding-left", (chavalue-orgleft)+"px");				
						if(ulwidth>0){
							$(this).children("ul:eq(0)").css("width", (ulwidth-chavalue+orgleft)+"px");
						}	
					}else{
						if(chavalue>orgleft && charightvalue>orgright){
							$(this).children("ul:eq(0)").css("padding-left", (ulwidth-childliwidth-2)+"px");
							if(ulwidth>0){
								if(childliwidth>ulwidth) childliwidth=ulwidth;
								$(this).children("ul:eq(0)").css("width", (childliwidth+2)+"px");
							}
						}
					}		
				}
				
				if(!$(this).hasClass('wp_subtop'))
				{
					$(this).css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',3));
					$(this).css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',3));
					$(this).css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',3));
					$(this).css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',3));
				}
				if($(this).children('ul').length > 0)
				{
					$(this).children('ul').css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',2));
					$(this).children('ul').css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',2));
					$(this).children('ul').css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',2));
					$(this).children('ul').css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',2));

					$(this).children('ul').children('li').css({'background-image':'none','background-color':'transparent'});
				}
				var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
				if(type==2){
					var self = $(this);
					var pos = 0 ;
					var loops = 0;
					$('#nav_'+layer_id).find('li').each(function(){
						if(loops == 1) return true;
						if(self.html() == $(this).html()){
							loops = 1;
							return true;
						}else{
							pos = pos + $(this).outerWidth();
						}	
						 
					})
					 
					$("#"+layer_id).find('.ddli').hide();
					var this_width = $('#nav_'+layer_id).outerWidth();
					var thisul_left = $('#nav_'+layer_id).css("padding-left");
					thisul_left = parseInt(thisul_left);
					$(this).children('.ddli').outerWidth(this_width).css("margin-left","-"+(thisul_left+pos)+"px");
					$(this).children('.ddli').eq(0).slideDown();
				}			
	 
		},function(){ 
				if(!$(this).hasClass('wp_subtop'))
				$(this).css({'background-color':'transparent','background-image':'none'});
				$(this).children("ul:eq(0)").css("left", "-99999px").hide(); 
				if(params.isedit){
					var isHover=true;
					$('#nav_'+layer_id).find('ul').each(function(){
						if($(this).css('display') != 'none') {isHover = false;}
					});
					if(isHover){			 
						var $toolbar = $(".propblk[super='"+layer_id+"']");
						if($toolbar.length > 0)  $toolbar.css('z-index','999');
					}	
				}
				var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
				if(type==2){
					$("#"+layer_id).find('.ddli').slideUp();
				}
		});

		$('.menu_'+menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var height = parseInt($(this).outerHeight());
			if(direction==1){				
				$(this).children('ul').css('top','auto').css('bottom',height + 'px');
			}else{				
				$(this).children('ul').css('top',height+'px').css('bottom','auto');	
			}
			if($(this).parent().hasClass('navigation'))
			{			
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",0),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",0),'color':window[layer_id+'_getSubMenuHoverCss']("color",0),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",0),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",0)});
			}else{			
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",1),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",1),'color':window[layer_id+'_getSubMenuHoverCss']("color",1),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",1),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",1)});
			}
			if($(this).parent().hasClass('navigation'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
		});
		wp_showdefaultHoverCss(layer_id);
		var is_exec=false;
		var func=function(){
			if(!is_exec){
				wp_removeLoading(layer_id);
				is_exec=true;
			}
		};
		$(function(){
			func();
		});
		
	});
};
function layer_media_init_func(layerid,params){
	var $curlayer=$('#'+layerid), _duration = -1;
	$('#wp-media-image_'+layerid).mouseover(function (event) {
		if($curlayer.data('wopop_effects') && $curlayer.hasClass('now_effecting')){
			return;
		}
		var effect=$curlayer.data('wopop_imgeffects');
		var $this=$(this);
		var running=$this.data('run');
		if(effect && running!=1){
			var effectrole = effect['effectrole'];
			var dset = effect['dset']; 
			var effectel=$curlayer;
			if(effectrole=='dantu' &&  effect['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content');
			}else if(effectrole !='dantu' && dset && dset['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content');
			}
			
			effectel.setimgEffects(true,effect,1);
			
			if(effectrole !='dantu' && typeof(dset)!="undefined"){
				// fixed bug#5949
				if ($curlayer.hasClass('now_effecting')) {
					_duration = dset.duration;
					$curlayer.wopop_effect_command('stop');
				}
				var temp_effect = {};
				temp_effect['type'] = effect['type'];
				temp_effect['effectrole'] = 'dantu';
				temp_effect['effect'] = effect['dset']['effect'];
				temp_effect['duration'] =  effect['dset']['duration'];
				effectel.setimgEffects(true,temp_effect,1);
			}
		}
	});
	// fixed bug#5949
	$curlayer.mouseleave(function(e){
		var $target = $(this), _tt = parseInt(_duration);
		if (!isNaN(_tt) && _tt >= 0 && !$target.hasClass('now_effecting')) {
			var timer = setTimeout(function(){
				$target.showEffects();
				_duration = -1;
				clearTimeout(timer);
			}, _tt);
		}
	});

	var imgover=$('#wp-media-image_'+layerid).closest('.img_over');
	imgover.children('.imgloading').width(imgover.width()).height(imgover.height());
	imgover.css('position','relative');
	$('#'+layerid).layer_ready(function(){
		layer_img_lzld(layerid);
	});
	if(!params.isedit && !params.has_effects){
		if ($('#'+$('#'+layerid).attr('fatherid')).attr('type') == 'pop_up') {
			$('#wp-media-image_'+layerid).attr('src',params.img_src);
			$('#wp-media-image_'+layerid).parents('.img_over:first').children('.imgloading').remove();
		}
	}
	
};
function detectZoom (){ 
    var ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase() || '';
    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }else if (~ua.indexOf('msie')) {  
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    }else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio){
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}

function layer_unslider_init_func(params){
    var layerid = params.layerid;
    var module_height =params.module_height;
	if (layerid.length == 0) return;
    //Set module height start
    if(module_height && parseInt(module_height)){
        $('#'+layerid).css('height',module_height+'px').removeAttr('module_height');
        $('#'+layerid+' .wp-resizable-wrapper').css('height',module_height+'px');
    }//Set module height end
	var $content = $('#'+layerid+'_content');
	var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
	$content.css("border", params.pstyle);
	var fullparent = $content.parents('.fullpagesection').length;
	var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
	if(fullparent) { cnvpos.left = Math.abs($('.fullpagesection').css('left').replace('px','')); }
	cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
	var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
	if(fullparent) { canwidth = $(window).width(); }
	if(cnvpos.left<0) cnvpos.left=0;
	$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
	$('#'+layerid).css({left: '0',width: $('#canvas').width()});
	$('#'+layerid+' .banner').css("min-height", cntheight+'px'); $('#'+layerid+' .banner').css("height", cntheight+'px');
	$('#'+layerid+' .bannerul').css("height", cntheight+'px');
	$('#'+layerid+' .banner ul li').css("min-height", cntheight+'px').css('width',($('#scroll_container_bg').width() - borderwidth)+'px');$('#'+layerid+' .banner ul li').css("height", cntheight+'px');
	$('#'+layerid+' .banner .inner').css("padding", cntheight/2+'px 0px');
	$('#'+layerid).layer_ready(function(){
		var ctrldown = false;
		$(window).resize(function(){
				if(!ctrldown){
					setTimeout(function(){
						var $content = $('#'+layerid+'_content');
						var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
						var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
						cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
						var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
						if(cnvpos.left<0) cnvpos.left=0;
						$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
					},0)
				}
		})
		$(window).keydown(function(event){
				if(!event.ctrlKey){
					var $content = $('#'+layerid+'_content');
					var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
					var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
					cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
					var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
					if(cnvpos.left<0) cnvpos.left=0;
					$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});

				}else{
					ctrldown = true;
				}
		})
	})
	$('#'+layerid).layer_ready(function(){
			var transitionstr=params.easing;
		if(params.easing=='all'){
			transitionstr=($.browser.msie) ? "slide,slice,blocks,blinds,fade" : "slide,slice,blocks,blinds,shuffle,threed,fade";
		}
		if(params.default_show=='1'){
			var arrow_show='always';
		}
		if(params.hover_show=='1'){
			var arrow_show='mouseover';
		}
			var $content = $('#'+layerid +' #'+layerid +'_content');
			var cntheight = $content.parent().height();
			cntheight = $('#'+layerid+' .wp-unslider_content').height();
			if(cntheight=='') cntheight=267;
			var  cnpos = $('#'+layerid+' .wp-unslider_content').offset();
			var contentpos = (cntheight)-39;
			if(!params.arrow_left){
				var arrow_left='template/default/images/left_arrow.png';
			}else{
				var arrow_left=params.arrow_left;
			}
			if(!params.arrow_right){
				var arrow_right='template/default/images/right_arrow.png';
			}else{
				var arrow_right=params.arrow_right;
			}
			var scripts = document.getElementsByTagName("script");
			var jsFolder = "";
			for (var i= 0; i< scripts.length; i++)
			{
					if( scripts[i].src && scripts[i].src.match(/lovelygallery\.js/i))
					jsFolder = scripts[i].src.substr(0, scripts[i].src.lastIndexOf("/") + 1);
			}
			$LAB
			.script(relativeToAbsoluteURL('plugin/unslider/js/html5zoo.js?v=8')).wait(function(){
				if($('#'+layerid).data('wp_htmlzoo')) return;
				$('#'+layerid).data('wp_htmlzoo',true);
				var win_width = $('#scroll_container_bg').width();
				jQuery("#"+layerid+"html5zoo-1").html5zoo({
					jsfolder:jsFolder,
					width:win_width,height:cntheight,
					skinsfoldername:"",loadimageondemand:false,isresponsive:false,
					addmargin:true,randomplay:false,
					slideinterval:params.interval,     // 控制时间
					loop:0,
					autoplay:params.autoplays=='false'?false:true,
					skin:"Frontpage",
					navbuttonradius:0,
					navmarginy:contentpos,showshadow:false,
					navcolor:"#999999",
					texteffect:"fade",
					navspacing:12,
					arrowtop:50,
					textstyle:"static",
					navpreviewborder:4,
					navopacity:0.8,
					shadowcolor:"#aaaaaa",
					navborder:4,
					navradius:0,
					navmarginx:16,
					navstyle:"bullets",
					timercolor:"#ffffff",
					navfontsize:12,
					navhighlightcolor:"#333333",
					navheight:12,navwidth:12,
					navshowfeaturedarrow:false,
					titlecss:"display:block;position:relative;font:"+params.title_size+"px "+params.title_family+"; color:"+params.title_color+";",//font style
					arrowhideonmouseleave:500,
					arrowstyle:params.skin=='01'?'none':arrow_show,
					texteffectduration:win_width,
					border:0,
					timerposition:"bottom",
					navfontcolor:"#333333",
					borderradius:0,
					textcss:"display:block; padding:12px; text-align:left;",
					navbordercolor:"#ffffff",
					textpositiondynamic:"bottomleft",
					ribbonmarginy:0,
					ribbonmarginx:0,
					unsliderheight:cntheight,
					unsliderlid:layerid,
					arrowimage_left:arrow_left,
					arrowimage_right:arrow_right,
                                        nav_arrow_w_size:params.nav_arrow_w_size,
                                        nav_arrow_h_size:params.nav_arrow_h_size,
					navigation_style:params.navigation_style,
					navbg_hover_color:params.navbg_hover_color,
					nav_margin_bottom:params.nav_margin_bottom_size,
					nav_arrow:params.nav_arrow,
					nav_margin_left:params.nav_margin_left_size,
					nav_margin_right:params.nav_margin_right_size,
					skin:params.skin,
					pauseonmouseover:params.pauseonmouseover=='1'?true:false,
					slide: {
							duration:win_width,
							easing:"easeOutCubic",
							checked:true
					},
					crossfade: {
							duration:win_width,
							easing:"easeOutCubic",
							checked:true
					},
					threedhorizontal: {
							checked:true,
							bgcolor:"#222222",
							perspective:win_width,
							slicecount:1,
							duration:1500,
							easing:"easeOutCubic",
							fallback:"slice",
							scatter:5,
							perspectiveorigin:"bottom"
					},
					slice: {
							duration:1500,
							easing:"easeOutCubic",
							checked:true,
							effects:"up,down,updown",
							slicecount:10
					},
					fade: {
							duration:win_width,
							easing:"easeOutCubic",
							checked:true,
							effects:"fade",
					},
					blocks: {
							columncount:5,
							checked:true,
							rowcount:5,
							effects:"topleft,bottomright,top,bottom,random",
							duration:1500,
							easing:"easeOutCubic"
					},
					blinds: {
							duration:2000,
							easing:"easeOutCubic",
							checked:true,
							slicecount:3
					},
					shuffle: {
							duration:1500,
							easing:"easeOutCubic",
							columncount:5,
							checked:true,
							rowcount:5
					},
					threed: {
							checked:true,
							bgcolor:"#222222",
							perspective:win_width,
							slicecount:5,
							duration:1500,
							easing:"easeOutCubic",
							fallback:"slice",
							scatter:5,
							perspectiveorigin:"right"
					},
				 transition: transitionstr	
			});
			//html5zoo-text position
			var fontheight = $('#'+layerid+' .unslidertxtf').height();
			var textheight = parseInt(params.title_size)+10;
			if(params.show_title=='1'){					
					if($('#'+layerid+' .html5zoo-text-bg-1').css('display')=='none'){
						var fv = parseInt($('#'+layerid+' .html5zoo-title-1').css('font-size'));
						var sv = parseInt($('#'+layerid+' .html5zoo-text-1').css('padding-top'));
						fontheight = fv+sv*2;
					}else if(fontheight<textheight){
						fontheight = fontheight+textheight;
					}
			}
			
			$('#'+layerid+' .unslidertxtf').css({'top':(cntheight-fontheight)});
			if(params.show_nav=='0'){				
				$('#'+layerid+' .dotsnew-nav').css({'display':'none'});
			}
		});    
	});
	
};
function layer_breadcrumb_ready_func(layerid, showorder){
	if (showorder == '2') {
		var $span_home=$("#"+layerid).find(".breadcrumb_plugin span").eq(0).clone();
		var $span_fuhao=$("#"+layerid).find(".breadcrumb_plugin span").eq(1).clone();
		$("#"+layerid).find(".breadcrumb_plugin span").eq(0).remove();
		$("#"+layerid).find(".breadcrumb_plugin span").eq(0).remove();
		$("#"+layerid).find(".breadcrumb_plugin").append($span_fuhao).append($span_home);
	}
	
	var fuhao1=['>>','※','◇','→','—','∷','⊙','☆','》','～','＞','＆','★','￤','#','≡'];
	var fuhao2=['<<','※','◇','←','—','∷','⊙','☆','《','～','<','＆','★','￤','#','≡'];
    window['ShowOrder'] = function(gzfuhao,plugin_id){
        $span_html=$($("#"+plugin_id).find(".breadcrumb_plugin").html()).clone();
        $("#"+plugin_id).find(".breadcrumb_plugin").html('');
        $.each($span_html,function(i,n){
            $("#"+plugin_id).find(".breadcrumb_plugin").prepend($(n));
        });
        $("#"+plugin_id).find(".breadcrumb_plugin").find("span:odd").html(gzfuhao);
    };
    window['ShowOrder2'] = function(plugin_id){
        if($("#"+plugin_id).find(".breadcrumb_plugin").find('span').last().attr('gzdata')!='gzorder') {
            ShowOrder(fuhao2[$('#'+plugin_id).find(".breadcrumbfuhao").attr("gz")],plugin_id);
        }
    };
    window['ShowOrder1'] = function(plugin_id){
        if($("#"+plugin_id).find(".breadcrumb_plugin").find('span').last().attr('gzdata')=='gzorder') {
            ShowOrder(fuhao1[$('#'+plugin_id).find(".breadcrumbfuhao").attr("gz")],plugin_id);
        }
    };
};
var jeditMode = 0;
function layer_prdcat_setvar(params){
    jeditMode = params.isedit;
    if(jeditMode){
        $(function(){
            $("#"+params.layerid+" li a").removeAttr('onclick').click(function(){return false;});
        });
    }
}

function wp_getdefaultHoverCss(layer_id)
{
	var getli='';
	var geta='';
	var cssstyle='';
 
	if(jeditMode){
	var navStyle = $.trim($("#datasty_"+layer_id).text());
	}else{
	var navStyle = $.trim($("#"+layer_id).data("datasty_"));
	}
	if(navStyle.length > 0)
	{
		var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
		var tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp1 = tmp[0].match(/{[^}]+}/)[0];
			tmp1=tmp1.replace('{','').replace('}','');
			getli=getli+tmp1;
		}
 
		patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
		tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp2 = tmp[0].match(/{[^}]+}/)[0];
			tmp2=tmp2.replace('{','').replace('}','');
			geta=geta+tmp2;
		}		
		
		
	}
	if(jeditMode){
	navStyle = $.trim($("#datastys_"+layer_id).text());
	}else{
	navStyle = $.trim($("#"+layer_id).data("datastys_"));
	}
 
	var getlia='';
	if(navStyle.length > 0)
	{		 
		var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestr='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestr=combilestr+ervervalue;
			}
			geta=geta+combilestr;
		}
		
		layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestrs='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestrs=combilestrs+ervervalue;
			}
			getli=getli+combilestrs;
		}
	 
		
	}

	if(getli.length>0){
		getli="#"+layer_id+" li.lihover{"+getli+"} ";
	}
	if(geta.length>0){
		geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
	}
	cssstyle=getli+geta;
	if(cssstyle.length>0){
		cssstyle=""+cssstyle+"";
		cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
          var doms=$('#'+layer_id);
		var oldcssstyle=doms.data('get_layer_hover_css');
         if(oldcssstyle != cssstyle){
                if(jeditMode){
                $("#hover"+layer_id+"").text(""+cssstyle+"");
                }
                doms.data('get_layer_hover_css',cssstyle);
                get_plugin_css('H'+layer_id+'H',cssstyle);
         }
	}
}

function wp_createNavigationgetSubMenuHoverCssFunc(param){
	var layer_id=param.layer_id;
	var editmode=param.editmode;
	function getSubMenuHoverCss(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		if(editmode){
			var navStyle = $.trim($("#datastys_"+layer_id).text());
		}else{
			var navStyle = $.trim($("#"+layer_id).data("datastys_"));
		}
		if(navStyle.length > 0){
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		if(editmode){
			navStyle = $.trim($("#datasty_"+layer_id).text());
		}else{
			navStyle = $.trim($("#"+layer_id).data("datasty_"));
		}
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);

			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}
		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	}
	window[layer_id+'_getSubMenuHoverCss']=getSubMenuHoverCss;
}

function wp_showdefaultHoverCss(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
		return window['wp_showdefaultHoverCss_'+layertype](layer_id);
	}
	return false;
}

function wp_showdefaultHoverCss_product_category(layer_id)
{
	var plugin_name=$("#"+layer_id).attr('type');
	var hover=$("#"+layer_id).find('.nav1').attr('hover');
	if(hover!=1){ return;}
	
	wp_getdefaultHoverCss(layer_id);
	var n=0;
	
	if(plugin_name=='new_navigation'){
		var page_id=$("#page_id").val();
                var rootpid=$("#page_id").attr("rpid")*1;
	}else{
		var page_id=$('#'+layer_id+'').find(".default_pid").html();
		if(page_id==0 || page_id.length==0){
			page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');	
		}
	}
	$('#nav_'+layer_id+'').children('li').each(function(){
		var type_pid=$(this).attr('pid');
		if(type_pid==page_id){
			$(this).addClass("lihover").children('a').addClass("ahover");
		}else if(type_pid==rootpid){
                    $(this).addClass("lihover").children('a').addClass("ahover");
                }
		if(window.location.href == $(this).find("a").attr("href") || window.location.href == $(this).find("a").attr("href")+"&brd=1"){ $(this).addClass("lihover").children('a').addClass("ahover"); }
		n++;
	});
	if(!$('#nav_'+layer_id+'').children('li.lihover').length){
		$('#nav_'+layer_id+' ul').children('li').each(function(){
			var lochref=window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');
			var subahref= $(this).find('a').attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');
			if(lochref == subahref || lochref ==subahref+"&brd=1"){ 
				$(this).parents(".wp_subtop").addClass("lihover").children('a').addClass("ahover"); 
				return;
			}
		})
	}

}

function wp_addMoreButton(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_addMoreButton_'+layertype]){
		return window['wp_addMoreButton_'+layertype](layer_id);
	}
	return false;
}

function wp_addMoreButton_product_category(layer_id)
{
	var firstLiTop = 0;
	var hasMore = false;
	$('#nav_'+layer_id).children('li.wp_subtop').each(function(i){
		if(i == 0) {firstLiTop = $(this).offset().top;return true;}	
		if($(this).offset().top > firstLiTop)
		{
			$('#'+layer_id).data('hasMore','yes');//配置逻辑获取
			var more = $.trim($('#'+layer_id).children('.wp-product_category_content').children('.nav1').attr('more'));
			var doms = $(this).prev().prev().nextAll().clone();
			var objA = $(this).prev().children('a');
			if(objA.children('span').length > 0) objA.children('span').html(more);
			else objA.html(more);

			if(objA.hasClass('sub'))
			{
				objA.next('ul').empty();
				doms.appendTo(objA.next('ul'));
			}
			else
			{
				objA.after('<ul></ul>');
				doms.appendTo(objA.next('ul'));
				objA.addClass('sub');
			}
				
			$(this).prev().nextAll().remove();
			objA.next('ul').children('li').removeClass('wp_subtop');
			hasMore = true;

			objA.attr('href','javascript:void(0);');
			
			//点击"更多"弹出全站导航
			if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
			{
				objA.click(function (e){
					$('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
						containerId:'wp-product_category-simplemodal-container_'+layer_id,
						zIndex:9999,
						close:false,
						onOpen:function(dialog){
							dialog.overlay.fadeIn('slow', function(){
								dialog.container.slideDown('slow',function(){
									dialog.data.fadeIn('slow','swing',function(){
										$('.wp_menus').not('.wp_thirdmenu0').each(function(){
											var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
											$(this).css({position:'relative',left:left+'px'});
										});
									});
								});
							});
						},
						onClose:function(dialog){
							dialog.data.fadeOut('slow',function (){
								dialog.container.slideUp('slow', function () {
									dialog.overlay.fadeOut('slow', function () {
										$.modal.close();
									});
								});
							});
						}
					});
					return false;
				});
			}
			return false;
		}
	});
	if(!hasMore) $('#'+layer_id).data('hasMore','no');
	wp_showdefaultHoverCss(layer_id);
}

//编辑模式水平拖动动态刷新修改More按钮
function wp_updateMoreButton(layer_id)
{
	var $layer = $('#'+layer_id);
	var $nav1 = $layer.children('.wp-product_category_content').children('.nav1');
	var tmp_css = $.trim($("#datastys_"+layer_id).text());
	var tmp_cssa = $.trim($("#datasty_"+layer_id).text());
	$.post(parseToURL("product_category","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-product_category_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),function(data){
		$layer.find('.wp-product_category_content').html(data);
		$("#datastys_"+layer_id).text(tmp_css);
 					
		var setcss=$("#page_set_css").html();
		setcss=setcss.replace(/<style>/i,'').replace(/<\/style>/i,'');
		var reg=new RegExp("(.*)([/][/*]"+layer_id+"[/*][/])(.*)([/][/*]"+layer_id+"[/*][/])(.*)","gmi");
		var url=setcss;
		var rep=url.replace(reg,"$1 $5");
		var tempcss=rep + " /*"+ layer_id +"*/ "+tmp_cssa+" "+tmp_css+" /*"+ layer_id +"*/ ";
		tempcss = tempcss.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		$("#page_set_css").html('<style> '+tempcss+ '</style>');
	});
	wp_showdefaultHoverCss(layer_id);
}


function wp_removeLoading(layer_id)
{
	
	var $nav1 = $('#'+layer_id).find(".nav1");
	var ishorizon=$nav1.attr("ishorizon");
	if(ishorizon=='1'){
		$("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
	}else{
		$("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
	}
	// 修复IE浏览器部分版本导航无法显示问题 2013/12/26
 
	var temptimer = setTimeout(function(){
		$("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
		clearTimeout(temptimer);
	}, 50);
};
(function($){

	var patterns = {
		text: /^['"]?(.+?)["']?$/,
		url: /^url\(["']?(.+?)['"]?\)$/
	};

	function clean(content) {
		if(content && content.length) {
			var text = content.match(patterns.text)[1],
				url = text.match(patterns.url);
			return url ? '<img src="' + url[1] + '" />': text;
		}
	}

	function inject(prop, elem, content) {
		if(prop != 'after') prop = 'before';
		if(content = clean(elem.currentStyle[prop])) {
			$(elem)[prop == 'before' ? 'prepend' : 'append'](
				$(document.createElement('span')).addClass(prop).html(content)
			);
		}
	}

	$.pseudo = function(elem) {
		inject('before', elem);
		inject('after', elem);
		elem.runtimeStyle.behavior = null;
	};
	
	if(document.createStyleSheet) {
		var o = document.createStyleSheet(null, 0);
		o.addRule('.dummy','display: static;');
		o.cssText = 'html, head, head *, body, *.before, *.after, *.before *, *.after * { behavior: none; } * { behavior: expression($.pseudo(this)); }';
	}

})(jQuery);
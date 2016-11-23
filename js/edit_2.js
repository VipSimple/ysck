
/* 用户信息 */
var userInfoIsOver = false;  // 默认用户信息不完整

// 文件上传 变量
var curInputFile; // 当前触发的file对象
var curInputValue;  //当前触发file对象的值
var len; //当前上传文件长度；
var files; // 当前上传文件列表 数组
var src;  // blob 对象 转换后的file值
var url = window.URL || window.webkitURL || window.mozURL;
var that; // 代替this

var curItem;  //当前条目
var curIndex;  //当前操作条目索引值
var isAddItem = false;   //是否需要添加新条目 默认为否
var isBeforeInsert = true;  //是否在当前条目之前添加新条目  默认为是
var isTextItem = false; //是否添加的是文本条目  默认为否

var maxSize = 200 * 1024;

/* 编辑文本对象 */
var textInput;  //编辑框对象
var textInputVal;  //文本值

var articleTile;  // 文章标题
var articleCont;  // 文章内容

var isEditArticle = true;  // 编辑的是文章还是标题  默认文章


/* 移动条目相关对象 */
var curEle;  //当前元素
var curEleTop; //当前元素位置
var curOfEle; //对应元素
var curOfEleTop;  //对应元素位置
var marginTop = parseInt($('.edit-article-item').css('margin-top')); 
var aniTime = parseFloat($('.edit-article-item').css('transition-duration')) * 1000;  // 动画过渡时间
var timer;
var isTop = false;  // 是否是向上移动  默认为否

/* 渲染元素 */
var curEleAttr ; 
var curOfEleAttr ; 

/* 索引值 */
var curEleIndex;
var curOfEleIndex;

/* 生成新条目对象 */
var itemBox = $('.edit-article-bd');
var tmplForImg = '<div class="edit-article-item newItem current-article-item" data-vcxx-sort="1" data-vcxx-imgText="" data-vcxx-text="">'+
		'<div class="edit-article-img">'+
			'<div class="article-img" style="background-image:url(#url#);"></div>'+
		'</div>'+
		'<div class="edit-article-text">'+
			'<p class="article-text line-04 placeholder">点击添加文字</p>'+
		'</div>'+
		'<div class="edit-article-delete"></div>'+
		'<div class="edit-add_top">'+
			'<div class="add_top_bit"></div>'+
			'<div class="edit-add-check-top">'+
				'<div class="edit-add-option_text">文本</div>'+
				'<div class="edit-add-option_img">'+
					'<span>图片</span><input class="uploaderInput" type="file" accept="image\/\*" multiple="">'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="edit-add_bottom">'+
			'<div class="add_bottom_bit"></div>'+
			'<div class="edit-add-check-bottom">'+
				'<div class="edit-add-option_text">文本</div>'+
				'<div class="edit-add-option_img">图片</div>'+
			'</div>'+
		'</div>'+
		'<div class="pos-arrow arrow_top">^</div>'+
		'<div class="pos-arrow arrow_bottom">^</div>'+
	'</div>';
var tmplForText = '<div class="edit-article-item newItem current-article-item" data-vcxx-sort="1" data-vcxx-imgText="" data-vcxx-text="">'+
		'<div class="edit-article-img">'+
			'<div class="article-img" style="background-image:url(img/placeholder.jpg);"></div>'+
		'</div>'+
		'<div class="edit-article-text">'+
			'<p class="article-text line-04">#text#</p>'+
		'</div>'+
		'<div class="edit-article-delete"></div>'+
		'<div class="edit-add_top">'+
			'<div class="add_top_bit"></div>'+
			'<div class="edit-add-check-top">'+
				'<div class="edit-add-option_text">文本</div>'+
				'<div class="edit-add-option_img">'+
					'<span>图片</span><input class="uploaderInput" type="file" accept="image\/\*" multiple="">'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="edit-add_bottom">'+
			'<div class="add_bottom_bit"></div>'+
			'<div class="edit-add-check-bottom">'+
				'<div class="edit-add-option_text">文本</div>'+
				'<div class="edit-add-option_img">图片</div>'+
			'</div>'+
		'</div>'+
		'<div class="pos-arrow arrow_top">^</div>'+
		'<div class="pos-arrow arrow_bottom">^</div>'+
	'</div>';

// 移除事件监听
function removeEvent(){

	$('.add_top_bit').unbind('click');
	$('.add_bottom_bit').unbind('click');
	$('.edit-add-option_img').unbind('click');
	$('.edit-article-text').unbind('click');
	$('.edit-add-option_text').unbind('click');
	$('.article-img').unbind('click');
	$('#submitBtn').unbind('click');
	$('.edit-article-delete').unbind('click');
	$('.arrow_bottom').unbind('click');
	$('.arrow_top').unbind('click');
	
	$('input[type=file]').unbind('change');

}

// 绑定事件
function bindEvent(){

	// 提交按钮
	 $('#submitBtn').bind('click',function(){

	 	submitText();
		
	 })
	 
	 $('#submitTitleBtn').bind('click',function(){
		// TODO 文章 标题 提交
		 textInput = $('textarea[name="title"]');
		 textInputVal = textInput.val();
		 $('.edit-article-title').html(textInputVal);
		 $('.layerWrap, .shade').hide();
	 })
	 
	// 顶部 移除所有 展示当前
	$('.add_top_bit').bind('click',function(e){
		$('.edit-article-item').removeClass('add-in-top add-in-bottom');
		$(this).parents('.edit-article-item').addClass('add-in-top');
	})

	//  底部 移除所有 展示当前
	$('.add_bottom_bit').bind('click',function(e){
		$('.edit-article-item').removeClass('add-in-bottom add-in-top');
		$(this).parents('.edit-article-item').addClass('add-in-bottom');
	})

	// 编辑图片 触发file表单的事件
	$('.edit-add-option_img span').bind('click',function(e){
		
		isAddItem = true;
		isTextItem = false;

		// 判断是顶部还是底部
		if( $(this).parents('.edit-add_top').length > 0 ){
			isBeforeInsert = true;
		}else{
			isBeforeInsert = false;
		}
		
		// 获取当前条目索引值
		curItem = $(this).parents('.edit-article-item');
		curIndex = $(this).parents('.edit-article-item').index();

		// 找到顶部的file表单
		curInputFile = curItem.find('input[type=file]');
		curInputValue = curInputFile.value; //获取当前文件值

		// 设置动态的属性 data-id
		newTimeTamp = new Date().getTime() + Math.floor(Math.random()*10000);
		curInputFile.attr({ 'data-id' : newTimeTamp });

		curInputFile.click();

	})

	// 编辑标题
	$('.edit-article-title').bind('click',function(){

		confirmLayerTitleWrap();
	})
	
	// 编辑文本 
	$('.edit-article-text').bind('click',function(e){

		isAddItem = true;
		isTextItem = false;

		// 获取当前条目索引值
		curItem = $(this).parents('.edit-article-item');
		curIndex = $(this).parents('.edit-article-item').index();

		curItem.find('.article-text').removeClass('placeholder');

		confirmLayerWrap();


	})

	// 编辑文本 （ 按钮
	$('.edit-add-option_text').bind('click',function(e){

		isAddItem = true;
		isTextItem = true;

		// 判断是顶部还是底部
		if( $(this).parents('.edit-add_top').length > 0 ){
			isBeforeInsert = true;
		}else{
			isBeforeInsert = false;
		}

		// 获取当前条目索引值
		curItem = $(this).parents('.edit-article-item');
		curIndex = $(this).parents('.edit-article-item').index();

		curItem.find('.article-text').removeClass('placeholder');

		confirmLayerWrap();


	})


	// file表单触发时
	$('input[type=file]').bind('change',function(e){

		var editItem =  curItem;
		
		files = e.target.files;
		len = files.length;

		// 遍历出文件路径 src
		for(var i=0; i<len; i++){
			var file = files[i];

			if(url){
				src = url.createObjectURL(file);
			}else{
				src = e.target.result;
			}

			console.log(src);

			if(isAddItem){
				// 添加条目
				addItem(src);

			}else{
				// 更换图片
				changeImg(src);
			}
			
			var reader = new FileReader();
			var size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
			reader.onload = function() {
                var result = this.result,   //result为data url的形式
                    img = new Image();
                    img.src = result;

                //如果图片大小小于200kb，则直接上传
                if(result.length <= maxSize) {  
                	img = null;
                    imgUpload(result, file.type);      //图片直接上传
                    return;
                }

                //图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                    callback();
                } else {
                    img.onload = callback;
                }

                function callback() {
                    var data = compress(img);
                    
                    imgUpload(data, file.type);

                    img = null;
                }

            }
        	reader.readAsDataURL(file);
		}

		// 移除编辑按钮
		$('.edit-article-item').removeClass('add-in-top');

		removeEvent();
		bindEvent();
	});

	// 条目中图片对象绑定事件
	$('.article-img').bind('click',function(){

		isAddItem = false;

		that = $(this);

		curItem = $(this).parents('.edit-article-item');
		curIndex = $(this).parents('.edit-article-item').index();

		// 找到顶部的file表单
		curItem.find('.edit-add_top input[type=file]').click();


	})

	// 绑定删除事件
	$('.edit-article-delete').bind('click',function(){

		curItem = $(this).parents('.edit-article-item');
		removeItem();
	})
	
	// 元素移动 事件绑定
	// 移动
	$('.arrow_bottom, .arrow_top').bind('click',function(e){
		e.stopPropagation();

		if($(this).hasClass('arrow_top')){
			isTop = true;
		}else{
			isTop = false;
		}

		that = $(this);
		changeItemPos(that);

	})


}

// 增加条目
function addItem(src){

	// 判断添加位置
	if(isBeforeInsert){
		//如果是图片
		if(!isTextItem){
			curItem.before( $(tmplForImg.replace('#url#', src)) );
			
			// 进场动画
			$('.newItem').offset({left: innerWidth});
			
			if(timer != 'undefined'){ timer = undefined }
				timer = setTimeout(function(){

				$('.newItem').removeClass('newItem').offset({left:0});

				clearTimeout(timer);
			},30);

		}else{
			curItem.before( $(tmplForText.replace('#text#', "")) );

			// 进场动画
			$('.newItem').eq(0).offset({left: innerWidth});
			
			if(timer != 'undefined'){ timer = undefined }
				timer = setTimeout(function(){

				$('.newItem').removeClass('newItem').offset({ left: : 0 });

				clearTimeout(timer);
			},30);

		}

	}else{
		if(!isTextItem){

			curItem.after( $(tmplForImg.replace('#url#', src)) );
		}else{

			curItem.after( $(tmplForText.replace('#text#', "")) );
		}
	}

	curItem = $('.current-article-item');
	curItem.removeClass('current-article-item');
}

// 改变图片
function changeImg(src){
	that.css({'background-image':'url(' + src + ')'});
}

// 删除条目
function removeItem(){
	
	if(!curItem.attr('data-vcxx-imgtext')) {
		return;
	}
	
	curItem.offset({left: + window.innerWidth});

	if(timer != 'undefined'){ timer = undefined };

	timer = setTimeout(function(){

		curItem.remove();

		clearTimeout(timer);

	}, aniTime);
	
	JournalEditor.DeleteItem(curItem.attr('data-vcxx-imgtext'));
}

// 弹出编辑框
function confirmLayerWrap(){
	$('.textBox').show();
}

function confirmLayerTitleWrap() {
	$('.titleBox').show();
}

// 提交编辑内容
function submitText(){

	textInput = $('textarea[name="text"]');
	textInputVal = textInput.val();
	
	$('.layerWrap, .shade').hide();
	$('.edit-article-item').removeClass('add-in-top');

	var paramObj = {};
	
	if(isTextItem){
		addItem();

		removeEvent();
		bindEvent();
		
		if($('#uploaderBox').attr('data-vcxx-id')) {
			paramObj.journa_id = $('#uploaderBox').attr('data-vcxx-id');
		}
		
	}else{
		//curItem.find('.article-text').html(textInputVal);
		
		if($('#uploaderBox').attr('data-vcxx-id')) {
			paramObj.journa_id = $('#uploaderBox').attr('data-vcxx-id');
		}
		if(curItem.attr('data-vcxx-imgtext')) {
			paramObj.itme_imgtext_id = curItem.attr('data-vcxx-imgtext');
		}
	}
	
	paramObj.text = textInputVal;
	paramObj.is_text_top = $('input[name="is_text_top"]').val();
	paramObj.sort = 1;
	
	JournalEditor.PostText(paramObj, curItem);
}

// 文档加载完 初始化的一些东西
$(document).ready(function(){ 
	bindEvent();
}) 

// 彩刊 编辑器
var JournalEditor = (function() {
	var _this = {};
	_this.PostImg = function(data, itemObj) {
		$.ajax({
			  type: 'POST',
			  url: accessUrl('/mp/journalDraft/imgItem'),
			  data: data,
			  cache: false,  
		      contentType: false,  
		      processData: false,  
			  success: function(r) {
				 var itemData = r.content.data;
				 $('#uploaderBox').attr('data-vcxx-id', itemData.journa_id);
				 itemObj.attr('data-vcxx-imgtext', itemData.itme_imgtext_id);
			  },
			  dataType: 'json'
		});
	};
	_this.DeleteItem = function(itemId) {
		$.ajax({
			  type: 'DELETE',
			  url: accessUrl('/mp/journalDraft/deleteItem/' + itemId),
			  success: function(r) {
				 
			  },
			  dataType: 'json'
		});
	}
	_this.PostText = function(data, itemObj) {
			$.ajax({
				  type: 'POST',
				  url: accessUrl('/mp/journalDraft/textItem'),
				  data: data,
				  success: function(r) {
					  var itemData = r.content.data;
					 $('#uploaderBox').attr('data-vcxx-id', itemData.journa_id);
					 itemObj.attr('data-vcxx-imgtext', itemData.itme_imgtext_id);
					 itemObj.find('.article-text').html(itemData.text);
				  },
				  dataType: 'json'
			});
	};
	return _this;
})();

function compress(img){
	var initSize = img.src.length;
	var width = img.width;
	var height = img.height;

	//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	var ratio;
	if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }

	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;
	
	//铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

		// 计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

		//瓦片canvas
	    var tCanvas = document.createElement("canvas");
	    var tctx = tCanvas.getContext("2d");

        tCanvas.width = nw;
        tCanvas.height = nh;

        //利用canvas进行绘图
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
        console.log('大于100万: '+ tCanvas);
    } else {
        ctx.drawImage(img, 0, 0, width, height);
        console.log('小于100万: '+ tCanvas);
    }

    //进行最小压缩
	var ndata = canvas.toDataURL('image/jpeg', 0.1);
	
	console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
	
	// tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

	return ndata;
}


function imgUpload(basestr, type){
	var text = window.atob(basestr.split(",")[1]); //先将base64数据转成字符串
	// var buffer = new ArrayBuffer(text.length);
	// var ubuffer = new Uint8Array(buffer); //将字符串以8位整型的格式传入ArrayBuffer

	var buffer = new Uint8Array(text.length);

	for(var i = 0; i < text.length; i++) {
        buffer[i] = text.charCodeAt(i);   
    }

		//将8位整型的ArrayBuffer转成二进制对象blob
    var blob = getBlob([buffer], type);

    var xhr = new XMLHttpRequest();

    var formdata = getFormData();
    
    
    formdata.append('imagefile', blob);
    formdata.append('sort', 1);
    
    if(!isAddItem) {
		 if(curItem.attr('data-vcxx-imgtext')) {
		    	formdata.append('itme_imgtext_id', curItem.attr('data-vcxx-imgtext'));
		  }
    }
    if($('#uploaderBox').attr('data-vcxx-id')) {
    	formdata.append('journa_id', $('#uploaderBox').attr('data-vcxx-id'));
    }
    JournalEditor.PostImg(formdata, curItem);
}

function getBlob(buffer, format) {
    try {
      	return new Blob(buffer, {type: format});
    } catch (e) {
      	var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
      	buffer.forEach(function(buf) {
        	bb.append(buf);
    	});
      	return bb.getBlob(format);
    }
}
/**
   * 获取formdata
   */
function getFormData() {
    var isNeedShim = ~navigator.userAgent.indexOf('Android')
        && ~navigator.vendor.indexOf('Google')
        && !~navigator.userAgent.indexOf('Chrome')
        && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    return isNeedShim ? new FormDataShim() : new FormData()
 }

//改变条目位置
function changeItemPos(that){
	
		// 当前元素
		curEle = that.parents('.edit-article-item');
		curElePos = curEle.offset().height;

		// 获取当前元素索引
		curEleIndex = curEle.index();

		// 增加当前状态
		curEle.addClass('active');

		// 对应元素
		if(isTop){
			curOfEle = curEle.prev('.edit-article-item');
		}else{
			curOfEle = curEle.next('.edit-article-item');
			
		}

		curOfEleTop = curOfEle.offset().height;

		// 获取对应元素索引
		curOfEleIndex = curOfEle.index();

		// 增加当前状态
		curOfEle.addClass('active');

		if(isTop){
			curEle.offset({top: -curElePos - marginTop});
			curOfEle.offset({top: curOfEleTop + marginTop});
		}else{
			curEle.offset({top: curOfEleTop + marginTop});
			curOfEle.offset({top: -curElePos - marginTop});
		}

		// 渲染
		if(timer){timer = null}
		timer = setTimeout(function(){
			renduEle();

			clearTimeout(timer);
		},aniTime);

}

// 重新渲染当前移动的元素
function renduEle(){
	// 找到需要在之前插入新元素的元素
	var nextEle = $('.edit-article-item.active').eq(0).next('.edit-article-item');

	curEleAttr = itemBox.find('.edit-article-item').eq(curOfEleIndex).removeClass('active').css({'top':0}).prop("outerHTML");
	curOfEleAttr = itemBox.find('.edit-article-item').eq(curEleIndex).removeClass('active').css({'top':0}).prop("outerHTML");
	
	console.log($('.edit-article-item.active').eq(0).next('.edit-article-item'))

	if(isTop){
		nextEle.before( curOfEleAttr );
		nextEle.before( curEleAttr );
	}else{
		nextEle.before( curEleAttr );
		nextEle.before( curOfEleAttr );
	}

	curEle.remove();
	curOfEle.remove();

	removeEvent();
	bindEvent();
	
	var editArticleItem = $('#uploaderBox .edit-article-item');
	editArticleItem.each(function() {
		console.log($(this).index() + "============" +$(this).attr('data-vcxx-imgText'));
	});
}


//列表页 提交
$('#submitItemBtn').bind('click',function(){
	// 如果 用户信息完整 发布

	if(userInfoIsOver){
		//发布
	}else{
		$('.shareSettingBox').show();
	}

	// 如果不完整 打开编辑框
})


// 个人中心页 提交
$('#userSubmitBtn').bind('click',function(){

	//提交信息  。。

	$('.shareSettingBox').hide();
})

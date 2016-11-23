wx.config({
    debug: false,
    appId: appIdstr,
    timestamp: timestampstr,
    nonceStr: nonceStrstr,
    signature: signaturestr,
    jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
    ]
});

wx.ready(function () {
    wx.hideMenuItems({
        menuList: ['menuItem:copyUrl', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:originPage']
    });
    wx.onMenuShareAppMessage({
        title: wx_share_title,
        desc: wx_share_desc,
        link: wx_share_link,
        imgUrl: wx_share_img,
        trigger: function () {
            if (wx_share_link == undefined || wx_share_link == "")
            { alert("分享链接为空"); return; }
        },
        success: function () { }, cancel: function () { }, fail: function () { }
    });
    wx.onMenuShareTimeline({
        title: wx_share_title,
        desc: wx_share_desc,
        link: wx_share_link,
        imgUrl: wx_share_img,
        trigger: function () {
            if (wx_share_link == undefined || wx_share_link == "")
            { alert("分享链接为空"); return; }
        },
        success: function (res) { }, cancel: function (res) { }, fail: function (res) { }
    });
});
function ShareMessage(title, desc, link, imgUrl) {
    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        trigger: function () {
            if (wx_share_link == undefined || wx_share_link == "")
            { alert("分享链接为空"); return; }
        },
        success: function () { }, cancel: function () { }, fail: function () { }
    });
    wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl,
        trigger: function () {
            if (wx_share_link == undefined || wx_share_link == "")
            { alert("分享链接为空"); return; }
        },
        success: function (res) { }, cancel: function (res) { }, fail: function (res) { }
    });
}
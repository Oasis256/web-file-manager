$(function () {
    document.body.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    if (isMeeting && !isSpeaker) {
        window.addEventListener('message', function (e) {
            var msg = JSON.parse(e.data);
            switch (msg.type) {
                case 'page': {
                    play(msg.param);
                    break;
                }
            }
        }, false);
    }
    var nowpage = 0;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if ((bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        $(".full").hide();
        $("#fullScreen").hide();
        $("#print").hide();
        $("#zoom").hide();
        $(".ppt-turn-left-mask,.ppt-turn-right-mask").remove();
        $(".showPic").swipe(
            {
                swipe: function (event, direction, distance, duration, fingerCount) {
                    if (direction == "right") {
                        if (nowpage <= 0) {
                            nowpage = 0;
                        } else {
                            nowpage--;
                        }
                        play(nowpage);
                    }
                    else if (direction == "left") {
                        if (nowpage >= datas.length - 1) {
                            nowpage = datas.length - 1;
                        } else {
                            nowpage++;
                        }
                        play(nowpage);
                    }
                }
            }
        );
    }
    $('body').bind("selectstart", function () { return false; });
    var loader = {
        el: $('#loading div'),
        per: 30,
        set: function (n) {
            this.per = n;
            this.el.width(n + '%');
        },
        fake: function (isfinished) {
            if (isfinished) {
                this.set(100);
                clearTimeout(this.timmer);
                return;
            }
            var self = this;
            this.timmer = setTimeout(function () {
                self.set(self.per += 10);
                self.fake();
            }, 400);
        }
    },
        title = $('#title').hide(),
        sidebar = $('#sidebar').hide(),
        mainbody = $('#mainbody').hide(),
        playImg,
        thumbnail,
        datas,
        currentIndex = false,
        play = function (index) {
            nowpage = index;
            var data = datas[index];
            if (typeof (data) == "undefined") return false;
            loader.set((index + 1) * 100 / thumbnail.length);
            if (currentIndex !== false) thumbnail.eq(currentIndex).removeClass("active");
            currentIndex = index;
            $("#pageNum span:eq(0)").html((currentIndex + 1) + "/" + datas.length);
            var dom = thumbnail.eq(index).addClass("active")[0];
            if (dom.scrollIntoViewIfNeeded) dom.scrollIntoViewIfNeeded();
            if (!playImg) {
                playImg = $('<img class="playimg" src="' + data.url + '">').appendTo($(".box_div"));
            } else {
                playImg.attr('src', data.url);
            }
            prevBtn.toggle(index !== 0);
            nextBtn.toggle(index !== thumbnail.length - 1);
            if (isSpeaker) {
                var msg = {};
                msg.type = 'page';
                msg.param = index;
                parent.postMessage(JSON.stringify(msg), serverhost);
            }
        },
        next = function () {
            if (currentIndex < thumbnail.length - 1) {
                play(currentIndex + 1);
            }
        },
        prev = function () {
            play(currentIndex - 1);
        },
        nextBtn = $('.ppt-turn-right-mask').click(next),
        prevBtn = $('.ppt-turn-left-mask').click(prev),
        JudgmentBrowser = function () { //判断IE11以下版本
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            var browser = {
                versions: function () {
                    var u = navigator.userAgent;
                    return {
                        trident: u.indexOf('Trident') > -1,
                        //IE内核
                    }
                }()
            };
            if (browser.versions.trident && !isIE11) return true;
        },
        fullScreen = function () { //进入全屏
            var docElm = document.body;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
            if (JudgmentBrowser) iefull();
        },
        exitScreen = function () { //退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else {
                window.parent.showTopBottom();
            }
            if (JudgmentBrowser) iefull();
        },
        bindOpenSide = function () {
            var screenWidth = document.documentElement.clientWidth || window.innerWidth;
            if ($("body").hasClass("fullScreen")) {
                $('body').removeClass("openSide")
                $("#header").css("background-color", "transparent")
            } else {
                if (screenWidth <= 960) {
                    $('body').removeClass("openSide")
                } else {
                    $('body').addClass("openSide")
                }
            }
            $(".openSide").length > 0 ? $("#pageNum").css("left", screenWidth * 0.58 - 50) : $("#pageNum").css("left", screenWidth / 2 - 50)
            aw = $(".showPic").width();
        },
        //ie低版本的全屏，退出全屏都这个方法
        iefull = function () {
            var el = document.documentElement;
            var rfs = el.msRequestFullScreen;
            if (typeof window.ActiveXObject != "undefined") {
                //这的方法 模拟f11键，使浏览器全屏
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            }
            //注：ie调用ActiveX控件，需要在ie浏览器安全设置里面把 ‘未标记为可安全执行脚本的ActiveX控件初始化并执行脚本' 设置为启用
        },
        fullScreenChange = function (x) {
            $('body').toggleClass('fullScreen', x);
            if ($('body').hasClass('fullScreen')) {
                $("#header").css("background-color", "transparent");
                $("#zoomNum").css("color", "white")
            } else {
                $("#header").css("background-color", "");
                $("#zoomNum").css("color", "")
            }
        };
    $('#fullScreen').click(function () {
        if ($('body').hasClass('fullScreen')) {
            exitScreen();
        } else {
            fullScreen();
            setTimeout(function () {
                $('body').removeClass("openSide")
            }, 50);
        }
    });
    $(window).resize(bindOpenSide).resize();
    $('#sideBtn').click(function () {
        var screenWidth = document.documentElement.clientWidth || window.innerWidth;
        $('body').toggleClass('openSide');
        $(".openSide").length > 0 ? $("#pageNum").css("left", screenWidth * 0.58 - 50) : $("#pageNum").css("left", screenWidth / 2 - 50)
        $(".openSide").length > 0 ? aw = $(".showPic").width() : aw = $(".showPic").width();
    });
    if (document.addEventListener) {
        document.addEventListener("fullscreenchange", function () {
            fullScreenChange(document.fullscreen);
        });
        document.addEventListener("mozfullscreenchange", function () {
            fullScreenChange(document.mozFullScreen);
        });
        document.addEventListener("webkitfullscreenchange", function () {
            fullScreenChange(document.webkitIsFullScreen);
        });
        document.addEventListener("MSFullscreenChange", function () {
            fullScreenChange(document.msFullscreenElement);
        });
    }
    loader.fake();
    loadData(v);
    function loadData(v) {
        loader.fake(true);
        var a = jQuery.parseJSON(v);
        datas = a.data;
        title.text(a.name);
        var s = "",
            len = datas.length;
        jQuery.each(datas, function (i, o) {
            s += '<div class="thumbnail" data-index="' + i + '"><img src="' + o.thumbUrl + '"><div class="side-pager">' + (i + 1 + '/' + len) + '</div></div>';
        });
        thumbnail = sidebar.html(s).children().on('click', function () {
            play($(this).data('index'));
        });
        play(0);
        setTimeout(function () {
            title.fadeIn('fast');
            sidebar.fadeIn();
            mainbody.fadeIn('slow');
            aw = $(".showPic").width();
        }, 400);
        $(document).keydown(function (event) {
            if (event.which == "37" || event.which == "38") { prev() }
            if (event.which == "39" || event.which == "40") { next() }
        });
    }
    var ie = window.ActiveXObject ? window.atob ? 10 : document.addEventListener ? 9 : document.querySelector ? 8 : window.XMLHttpRequest ? 7 : 6 : undefined;
    if (ie < 9) {
        var mediaWidth = 960;
        $(window).resize(function (e) {
            var h = $(window).height() - 40;
            sidebar.height(h);
            mainbody.height(h - 20);
            $('body').toggleClass('media', $(window).width() > mediaWidth);
        }).resize();
    }
});
//以下新增打印模式
if (window.fileServerPath && window.serverUrl) {
    $("#header").append('<a id="print" style="margin-right:20px;margin-top: -38px;" class="pull-right hbtn" href="#"><img width="40" height="40" src="./3.files/print.png"></a>');
    $("#print").click(function () {
        createModal($("body"));
        onPrint(serverUrl, fileServerPath);
    })
}
if (!window.isFullScreen) {
    $("#fullScreen").hide();
}
function createModal(parent) {
    parent.append('<div id="modal" style="position: fixed;width: 100%;height: 100%;background-color: rgba(211, 211, 211,0.3);text-align: center;color: black;font-size: 25px;"></div>');
    $("#modal").css("line-height", $("#modal").height() + "px");
    setTimeout(function () {
        $("#modal").text("正在打印，请稍后...");
    }, 200);
}
function onPrint(url, inputDir) {
    $.ajax({
        url: url + "/convert",
        data: {
            "inputDir": inputDir,
            "convertType": 3
        },
        dataType: "json",
        type: "post",
        success: function (data) {
            var index = inputDir.lastIndexOf("/");
            var fileName = inputDir.substring(index + 1);
            var base64 = encodeURIComponent(btoa("filePath=" + data.data[0] + "&fileName=" + fileName));
            $("#modal").remove();
            window.open(url + "/canvas/pdf/index.html?" + base64);
        },
        error: function (data) {
            $("#modal").remove();
            console.error(data);
        }
    })
}
//end

//以下添加缩放按钮
var s = 70;
$("body").append('<div id="zoom"><button id="zoomOut"></button><span id="zoomNum">100%</span><button id="zoomIn"></button></div>');
$("#zoomOut").click(function () { zoomTab(0) });
$("#zoomIn").click(function () { zoomTab(1) });
function zoomTab(type) {
    var index = $("#zoomNum").text().indexOf("%")
    var text = $("#zoomNum").text().substring(0, index);
    var scale = parseFloat(text) / 100
    if (type) {
        if (scale == 2.2) return;
        scale += 0.2;
        scale = Math.round(scale * 100) / 100;
        s += 5;
        $(".playimg").css("width", s + "%")
        $(".ppt-turn-left-mask").css({
            "left": (100 - s) / 2 + "%",
            "width": s / 2 + "%"
        })
        $(".ppt-turn-right-mask").css({
            "right": (100 - s) / 2 + "%",
            "width": s / 2 + "%"
        })
        $("#zoomNum").text((scale * 100).toFixed(0) + "%");
    } else {
        if (scale == 0.2) return;
        scale -= 0.2;
        scale = Math.round(scale * 100) / 100;
        s -= 5;
        $(".playimg").css("width", s + "%")
        $(".ppt-turn-left-mask").css({
            "left": (100 - s) / 2 + "%",
            "width": s / 2 + "%"
        })
        $(".ppt-turn-right-mask").css({
            "right": (100 - s) / 2 + "%",
            "width": s / 2 + "%"
        })
        $("#zoomNum").text((scale * 100).toFixed(0) + "%");
    }
}

$(".box_div").width($(".ppt-turn-left-mask").width() + $(".ppt-turn-right-mask").width());
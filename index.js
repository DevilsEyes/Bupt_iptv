function Resize(){

    var H = $(window).height();
    var W = $(window).width();
    if(H>=1000){
        $('.station').height(310);
        $('#sc').height(300);
        $('.Sub>div:last-child').height(310);
        $('.Sub').css("margin-top","-396px");
        var M = H-540;
        window.SH = 300;
    }
    else if(H>=800){
        $('.station').height(260);
        $('#sc').height(250);
        $('.Sub>div:last-child').height(260);
        $('.Sub').css("margin-top","-346px");
        var M = H-490;
        window.SH = 250;
    }
    else{
        $('.station').height(210);
        $('#sc').height(200);
        $('.Sub>div:last-child').height(210);
        $('.Sub').css("margin-top","-296px");
        var M = H>540? H-440:100;
        window.SH = 200;
    }


    $("header").css("padding-top",M/20*7);
    $("header").css("padding-bottom",M/20*4);
    $("footer").css("padding-top",M/20*5);
    $("footer").css("padding-bottom",M/20*4);

    if((W/H)>(16/9)){
        $('#bg>img').css({width:"100%",height:"auto"});
    }
    else{
        $('#bg>img').css({width:"auto",height:"100%"});
    }

}

function play(){
    var id = $(this).attr('id').substr(4);
    if(MOBILE){
        window.open("http://tv6.byr.cn/hls/"+ DATA.StationList[id].Link +".m3u8");
    }
    else{
        window.open("http://tv.byr.cn/player.html?channel="+ DATA.StationList[id].Link);
    }
}

function NavLeave(){
    $('#UnLi').css("margin-left", 20+(130*window.TAB));
}

function NavHover(){
    var id = $(this).attr('id').substr(4);
    $('#UnLi').css("margin-left", 20+(130*id));
}

function NavTab(){

    var PageHover = function() {
        var id = $(this).attr("id").substr(3);
        isc.scrollTo(0,-SH*id,300);
        $('.pagetab>span').removeClass('ps');
        $(this).addClass('ps');
    };

    var PageCheck = function(){
        if(this.y%100 == 0 ){return;}
        var n = Math.floor(Math.abs(this.y-SH/2) / SH);
        $('.pagetab>span').removeClass('ps');
        $('.pagetab>span:eq('+n+')').addClass('ps');
    };

    if(window.tab==true){return;}
    window.tab=true;
    var id = $(this).attr('id').substr(4);
    if(window.TAB==id){window.tab=false;return;}


    $('#myCss').attr('href',id+".css");
    $('#bg').append("<img src='img/bg"+id+".jpg'>");
    Resize();
    $('#bg>img:last-child').css("z-index",-10);
    $('#bg>img:first-child').animate({opacity:0},300,function(){$('#bg>img:first-child').remove();$('#bg>img').css("z-index",0);})
    window.TAB=id;

    $('nav>div').removeClass("sel");
    $('#UnLi').css("margin-left", 20+(130*id));
    $(this).addClass("sel");

    var j;
    window.p=0;

    $('.pagetab>span').animate({opacity:0},200);
    $('.station').find('li').animate({opacity:0},200,function(){
        if(p==1){return};
        p=1;
        $('.station').find('li').remove();
        $('#sc>div').height(0);
        $('#sc>div').css('height','auto');
        for(var i=0;i<DATA.Category[id].Stations.length;i++){
            j = DATA.Category[id].Stations[i];
            if(DATA.StationList[j].status==1){
                $('.station>#sc>div').append("<li class='una'>"+ DATA.StationList[j].Name +"</li>");
            }
            else{
                $('.station>#sc>div').append("<li id='_sid" + j + "'>"+ DATA.StationList[j].Name +"</li>");
            }
        };
        var n = Math.ceil($('#sc>div').height() / SH);
        $('.pagetab').find('span').remove();

        if(n>1){
            for(var k=0;k<n;k++){
                $('.pagetab').append("<span id='_ps"+k+"'></span>");
                $('#_ps'+k).hover(PageHover);
            }
            $('.pagetab>span:first-child').addClass('ps');
            $('.pagetab>span').animate({opacity:1},200);

            $('#sc>div').height(Math.ceil($('#sc>div').height() / SH)*SH);
        }

        setTimeout(function(){
            window.isc = new IScroll('#sc',{
                bounce: true,
                scrollY: true,
                probeType: 3,
                snap: true,
                snapSpeed: 800
            });
            isc.on('scroll',PageCheck);
            isc.on('scrollEnd',PageCheck);
        },100);

        $('.station').find('li').click(play);
        $('.station').find('li').animate({opacity:1},200);
        window.tab=false;
    })
}

function initEle(){
    console.dir(DATA);
    for(var i=0;i<DATA.Category.length;i++){
        $('nav').append("<div id='_cid" + i + "'>" + DATA.Category[i].Class + "</div>");
        $('#_cid'+i).click(NavTab);
        $('#_cid'+i).hover(NavHover);
        $('#_cid'+i).mouseleave(NavLeave);
    }
    $('#_cid0').click();
    $('.Sub>div>h3').text(DATA.Notice.Title);
    $('.Sub>div>p').text(DATA.Notice.Content);
}

function init(){
    $.ajax({
        url:"test.js",
        success:function(){
            if(obj.status=='0'){
                window.DATA = obj.data;
                initEle();
            }
        }
    })
}

window.MOBILE = navigator.userAgent.match(/mobile/i)? true:false;
$(document).ready(init);
$(window).resize(Resize);
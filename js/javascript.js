var player=0;//黑方先手

var chessbox=
    [  //0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],//0
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//1
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//2
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//3
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//4
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//5
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//6
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//7
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//8
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//9
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//10
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//11
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//12
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//13
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//14
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],//15
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],//16
    ]//10x10点阵

window.onload=function(){
    document.getElementById('blackP').style.opacity=1;
    for (var x = 0; x < 17; x++) {
        for (var y = 0; y < 17; y++) {
            if(chessbox[x][y]===0){
                createbox("nochess",x,y);
            }else if(chessbox[x][y]===1){
                createbox("white",x,y);
            }else if(chessbox[x][y]===-1){
                createbox("black",x,y);
            }else{}
        }
    }
}

function luozi(e,x,y){//触发落子
    var ele=e.target;
    ele.setAttribute('onclick','');
    
    var nowPlayer=judgePlayer(x,y);

    if(nowPlayer==="white"){
        done("white",ele);
        document.getElementById('blackP').style.opacity=1;
        document.getElementById('whiteP').style.opacity=0;
    }else{
        done("black",ele);
        document.getElementById('blackP').style.opacity=0;
        document.getElementById('whiteP').style.opacity=1;
    }

    var i=judgeChess(x,y);
    if(i==='blackwin'){
        alert('黑胜');
        location.reload();
    }else if(i==='whitewin'){
        alert('白胜');
        location.reload();
    }else{}
    
}

function judgePlayer(x,y) {//判断玩家

    if(player%2===0){
        chessbox[x][y]=-1;//黑棋
        player++;
        return "black";  
    }else{
        chessbox[x][y]=1;
        player++;
        return "white"; 
    }
}

function judgeChess(x,y) {//判断棋局
        var c=[];
        var sign=0;
       c=aroundFind(x,y);
        if(c!==undefined){
            if(c===-1){
                return 'blackwin';
            }else{
                return 'whitewin';
            }
        }
}

function aroundFind(row,col) {//判断当前落子周围，发现同色返回相应参数
    var x=row;
    var y=col;
    var now=chessbox[x][y];
    
    var around=
        [    
            chessbox[x-1][y-1],chessbox[x-1][y],chessbox[x-1][y+1],
            chessbox[x][y-1],                   chessbox[x][y+1],
            chessbox[x+1][y-1],chessbox[x+1][y],chessbox[x+1][y+1],
        ];
        
    
    for(var i=0;i<around.length;i++){
        if(now===around[i]){
            if(i===0||i===7){
                if(find('lline',now,x,y)===5){
                    return now;
                }else{}
            }else{}
            if(i===1||i===6){
                if(find('td',now,x,y)===5){
                    return now;
                }else{}
            }else{}
            if(i===2||i===5){
                if(find('rline',now,x,y)===5){
                    return now;
                }else{}
            }else{}
            if(i===3||i===4){
                if(find('rl',now,x,y)===5){
                    return now;
                }else{}
            }else{}
        }else{}
    }
}

function find(direction,now,row,col){//对落子周围同色方向进行搜索
    var x=row;
    var y=col;
    var sign=0;
    var a=0;
    var b=0;

        switch (direction) {
            case 'lline':
                    if(chessbox[x-1][y-1]===now){
                        // alert('左上搜索');
                        a=deepFind(x,y,-1,-1,now,sign);
                    }else{}
                    if(chessbox[x+1][y+1]===now){
                        // alert('右下搜索');
                        b=deepFind(x,y,1,1,now,sign);
                    }else{}
                sign=1+a+b;
                return sign;
            case 'td':
                    if(chessbox[x-1][y]===now){
                        // alert('上方搜索');
                        a=deepFind(x,y,-1,0,now,sign);
                    }else{} 
                    if(chessbox[x+1][y]===now){
                        // alert('下方搜索');
                        b=deepFind(x,y,1,0,now,sign);
                    }else{}
                sign=1+a+b;
                return sign;
            case 'rline':
                    if(chessbox[x-1][y+1]===now){
                        // alert('右上搜索');
                        a=deepFind(x,y,-1,+1,now,sign);
                    }else{}
                    if(chessbox[x+1][y-1]===now){
                        // alert('左下搜索');
                        b=deepFind(x,y,1,-1,now,sign);
                    }else{}
                sign=1+a+b;
                return sign;
            case 'rl':
                    if(chessbox[x][y-1]===now){
                        // alert('左边搜索');
                        a=deepFind(x,y,0,-1,now,sign);
                    }else{}
                    if(chessbox[x][y+1]===now){
                        // alert('右边搜索');
                        b=deepFind(x,y,0,1,now,sign);
                    }else{}
                sign=1+a+b;
                return sign;
            default:break;
        }

}

function deepFind(x,y,dx,dy,now,sign) {//递归，具体对某方向进行深度搜索
    if(chessbox[x+dx][y+dy]===now){
        // alert('继续发现同色');
        sign++;
        return deepFind(x+dx,y+dy,dx,dy,now,sign);
    }else{
        return sign;
    }
}

function createbox(inbox,x,y){//创建棋盘
    var gezi=document.createElement("div");//创建格子
    var element=document.getElementById("qipan");
    gezi.setAttribute('class','qibox');
    gezi.setAttribute('onclick','luozi(event,'+x+','+y+')');                                                                                                                                                                            
    element.appendChild(gezi);
}

function done(inbox,gezi) {//落子
    if(inbox==="white"){
        var white=document.createElement("div");
        white.setAttribute('class','white');
        gezi.appendChild(white);
    }else if(inbox==="black"){
        var black=document.createElement("div");
        black.setAttribute('class','black');
        gezi.appendChild(black);
    }else{}
}
/*
function canNot() {
    alert('此处有子');
}*/
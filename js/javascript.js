var player=0;//黑方先手
var chessbox=[];

window.onload=function (){
    for(var a=0;a<23;a++){
        chessbox[a]=[];
        for(var b=0;b<23;b++){
            if(a===0||a===1||a===2||a===3||a===19||a===20||a===21||a===22||
            b===0||b===1||b===2||b===3||b===19||b===20||b===21||b===22){
                chessbox[a][b]=3;
            }else{
                chessbox[a][b]=0;
            }
        }
    }
    //代表棋盘的二维数组
    create();
}

function create(){
    document.getElementById('blackP').style.opacity=1;
    for (var x = 3; x < 20; x++) {
        for (var y = 3; y < 20; y++) {
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

function luozi(e,x,y){
    //触发落子
    var ele=e.currentTarget;
    ele.setAttribute('onclick','');
    //触发后将元素的点击事件变为空
    
    var nowPlayer=judgePlayer(x,y);
    //判断现在是哪位玩家

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
    
    //  if(nowPlayer==='black'){
    //       ai();
    //   }else{}
    
}

function ai(){
    player=1;
    //AI执白
    //alert('AI走步')
    var a=[]
    /*
    AI的走法,在一条线上进行搜索
        1.四白 2000分权值
        四白一黑
        四白两黑
        2.四黑 4000分权值
        四黑一白
        四黑二白
        3.三白 1000分权值
        4.三黑 500分权值
        5.三白一黑 4
        6.三黑一白 4
        7.三白二黑 1
        8.三黑二白 1
        9.二白 3分权值
        10.二黑 3分权值
        11.二黑一白 2分权值
        12.二白一黑 2分权值
        13.一黑 1分权值
        14.一白 1分权值
    */
    a=aiJudgeChess();
    chessbox[a[0]][a[1]]=1;
    deletebox();
    create();
}

function aiJudgeChess(){
    var row=0;
    var col=0
    var grade=0;
    for (var a = 4; a <19; a++) {
        for(var b=4;b<19;b++){
            if(chessbox[a][b]===0){
                var temp=aiFindAround(a,b)
                if(grade<=temp){
                    grade=temp;
                    row=a;
                    col=b;
                }
            }
        }
    }
    return [row,col];
}


function aiFindAround(row,col){
    var grade=0
    if(chessbox[row-1][col]!==0||chessbox[row+1][col]!==0){
        var td=aiJudgeGrade(1,0,row,col);
    }
    if(chessbox[row][col-1]!==0||chessbox[row][col+1]!==0){
        var lr=aiJudgeGrade(0,1,row,col);
    }
    if(chessbox[row-1][col-1]!==0||chessbox[row+1][col+1]!==0){
        var lline=aiJudgeGrade(1,1,row,col);
    }
    if(chessbox[row-1][col+1]!==0||chessbox[row+1][col-1]!==0){
        var rline=aiJudgeGrade(1,-1,row,col);
    }
    grade=td+lr+lline+rline;
    return grade;
}

function aiJudgeGrade(dx,dy,row,col){
    var grade=0;
    var one=chessbox[row+dx][col+dy];
    var two=chessbox[row+2*dx][col+2*dy];
    var three=chessbox[row+3*dx][col+3*dy];
    var four=chessbox[row+4*dx][col+4*dy];
    var _one=chessbox[row-dx][col-dy];
    var _two=chessbox[row-2*dx][col-2*dy];
    var _three=chessbox[row-3*dx][col-3*dy];
    var _four=chessbox[row-4*dx][col-4*dy];

    if((one!==0)||(one===_one===_two===two)){
        grade+=10000;
        //xx11111xx
    }else if((one!==0)||(one===_one===_two===_three)){
        grade+=10000;
        //xxx11111x
    }else if((one!==0)||(_one===one===two===three)){
        grade+=10000;
        //x11111xxx
    }else if((_one!==0)||_one===_two===_three===_four){
        grade+=10000;
        //xxxx11111
    }else if((one!==0)||(one===two===three===four)){
        grade+=10000;
        //11111xxxx
    }else if((one!==0)||(one===_one===two)||(three===_two===0)){
        grade+=10000;
        //x011110xx
    }else if((one!==0)||(one===_one===_two)||(_three===two===0)){
        grade+=10000;
        //xx011110x
    }else if((one!==0)||(one===two===three)||(four===_one===0)){
        grade+=10000;
        //011110xxx
    }else if((_one!==0)||(_one===_two===_three)||(_four===one===0)){
        grade+=10000;
        //xxx011110
    }
    // if((one!==0)||(_one===one)
    //||(_two===two===three===0)){
    //     grade+=10000;//x001110xx
    // }

    //else if((one!==0)||(_one===one)
    //||(_two===two===_three===0)){
    //     grade+=10000;//xx011100x
    // }
    
    //else if((one!==0)||(one===two)
    //||(_one===three===four===0)){
    //     grade+=10000;//001110xxx
    // }
    
    //else if((_one!==0)||(_one===_two)
    //||(one===_three===_four===0)){
    //     grade+=10000;//xxx011100
    // }
    if((one!==0)||(_one===one===two)){
        grade+=100;//xxx1111xx
    }else if((one!==0)||(_one===one===_two)){
        grade+=100;    //xx1111xxx
    }else if((one!==0)||(one===two===three)){
        grade+=100;    //xxxx1111x
    }else if((_one!==0)||(_one===_two===_three)){
        grade+=100;     //x1111xxxx
    }
    if((one!==0)||(_one===one)||(two===_two===0)){
        grade+=1000;//xx01110xx
    }else if((one!==0)||(one===two)||(_one===three===0)){
       grade+=1000; //x01110xxx
    }else if((_one!==0)||(_one===_two)||(one===_three===0)){
        grade+=1000;//xxx01110x
    }
    
    if((one!==0)||(_one===one)){ grade+=50;}
    if((one!==0)||(one===two)){ grade+=50;}
    if((one!==0)||(_one===_two)){ grade+=50;}
    //xxx111xxx
    //xx111xxxx
    //xxxx111xx

    if((_one!==0)||(one===_two===0)){ grade+=10;}
    if((one!==0)||(_one===two===0)){ grade+=10;}
    //xxx0110xx
    //xx0110xxx
    if(one!==0){ grade+=1;}
    if(_one!==0){ grade+=1;}
    //xxx11xxxx
    //xxxx11xxx
    return grade;
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

function find(direction,now,row,col){
    //对落子周围同色方向进行搜索
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

function deepFind(x,y,dx,dy,now,sign) {
    //递归，具体对某方向进行深度搜索
    if(chessbox[x+dx][y+dy]===now){
        // alert('继续发现同色');
        sign++;
        return deepFind(x+dx,y+dy,dx,dy,now,sign);
    }else{
        return sign;
    }
}

function createbox(inbox,x,y){
    //创建棋盘
    var element=document.getElementById("qipan");
    var gezi=document.createElement("div");
    //创建格子
    gezi.setAttribute('class','qibox');
    gezi.setAttribute('onclick','luozi(event,'+x+','+y+')');                                                                                                                                                                            
    element.appendChild(gezi);

    var tline=document.createElement("span");
    tline.setAttribute('class','tline');
    var dline=document.createElement("span");
    dline.setAttribute('class','dline');
    gezi.appendChild(tline);
    gezi.appendChild(dline);

    if(inbox!=='nochess'){
        done(inbox,gezi);
    }
}

function deletebox(){
    qibox=document.getElementsByClassName("qibox");
    for(var a=0;a<qibox.length;a++){
        qibox[a].parentNode.removeChild(qibox);
    }
        
}

function done(inbox,gezi) {
    //落子
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
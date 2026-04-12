var W = 1280;
var H = 720;
var L = -10;
var R = 10;
var B = -10;
var T = 10;
var PIXEL = 1;

var BLACK = '#000000';
var WHITE = '#ffffff';
var RED = '#ff0000';
var GRAY = "#757575";

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const round_up = (n) => Math.ceil(n * 100) / 100;
const round_down = (n) => Math.floor(n * 100) / 100;

function left_f(x, y){
    return 5 * Math.sin(x) - 5 * Math.cos(y);
}

function right_f(x, y){
    return y;
}

function r_state(x, y){
    var left_side = left_f(x,y);
    var right_side = right_f(x,y);
    return left_side - right_side > 0;
}

function r_region(u){
    var ratio_x = (R - L) / W;
    var ratio_y = (T - B) / H;
    var l = u[0] * ratio_x + L;
    var r = u[1] * ratio_x + L;
    var b = u[2] * ratio_y + B;
    var t = u[3] * ratio_y + B;
    var state = [false, false, false, false];
    state[0] = r_state(l, b);
    state[1] = r_state(r, b);
    state[2] = r_state(l, t);
    state[3] = r_state(r, t);
    return state;
}

function paint_area(c, u){
    var l = u[0];
    var r = u[1];
    var b = H - u[2];
    var t = H - u[3];

    fill(c);
    noStroke();
    rect(l, t, r - l, b- t);
}

function setup() {
    createCanvas(W, H);
    background(WHITE);
    graph();

    var zero_line;
    if(L <= 0 && R >= 0){
        zero_line = Math.floor(H * (0 - B) / (T - B));
        paint_area(GRAY, [0, W, zero_line - PIXEL / 2, zero_line + PIXEL / 2]);
    }

    if(B <= 0 && T >= 0){
        zero_line = Math.floor(W * (0 - L) / (R - L));
        paint_area(GRAY, [zero_line - PIXEL / 2, zero_line + PIXEL / 2, 0, H]);
    }
    
}

function graph(){
    paint_area(RED, [0, W, 0, H]);
    var k = gcd(W / PIXEL, H / PIXEL);
    k = Math.floor(Math.log2(gcd(k , Math.pow(2, Math.floor(Math.log2(k))))));

    var k_2 = Math.pow(2, k);
    var u = [], repeat, i = 0;
    for(var a = 0; a * k_2 < W; a += 1){
        for(var b = 0; b * k_2 < H; b += 1){
            u.push([a * k_2, (a + 1) * k_2, b * k_2, (b + 1) * k_2]); 
       }
    }
    var left, right, bottom, top,dist;
    while(u.length > i){
        repeat = define_color(u[i], 0);

        if(repeat == true){
            left = u[i][0];
            right = u[i][1];
            bottom = u[i][2];
            top = u[i][3];
            dist = right - left;
            if(dist > PIXEL){
                dist /= 2;
                u.push([left, left + dist, bottom, bottom + dist]);
                u.push([left + dist, right, bottom, bottom + dist]);
                u.push([left, left + dist, bottom + dist, top]);
                u.push([left + dist, right, bottom + dist, top]);
            }
        }  
        i += 1;
    }
}

function define_color(u, comp){
    /*
    left side = right side-> 0
    left side > right side -> 1
    left side < right side-> 2
    left side >= right side-> 3
    left side <= right side-> 4
    left side >/< right side-> 5
    */
    var state = r_region(u);
    if(state[0] && state[1] && state[2] && state[3]){
        switch(comp){
            case 0:
                paint_area(WHITE, u);
                break;
            case 1:
                paint_area(BLACK, u);
                break;
            case 2:
                paint_area(WHITE, u);
                break;
            case 3:
                paint_area(BLACK, u);
                break;
            case 4:
                paint_area(WHITE, u);
                break;
            case 5:
                paint_area(BLACK, u);
        }
        return false;
    }
    else if(!(state[0] || state[1] || state[2] || state[3])){
        switch(comp){
            case 0:
                paint_area(WHITE, u);
                break;
            case 1:
                paint_area(WHITE, u);
                break;
            case 2:
                paint_area(BLACK, u);
                break;
            case 3:
                paint_area(WHITE, u);
                break;
            case 4:
                paint_area(BLACK, u);
                break;
            case 5:
                paint_area(BLACK, u);
        }
        return false;
    }
    else{
        switch(comp){
            case 0:
                paint_area(BLACK, u);
                break;
            case 1:
                paint_area(RED, u);
                break;
            case 2:
                paint_area(RED, u);
                break;
            case 3:
                paint_area(BLACK, u);
                break;
            case 4:
                paint_area(BLACK, u);
                break;
            case 5:
                paint_area(WHITE, u);
        }
        return true;
    }
}

function create_graph(input){
    alert(input);
    return "all good";
}

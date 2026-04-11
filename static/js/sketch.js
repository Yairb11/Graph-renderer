var W = 512;
var H = 512;
var L = -20;
var R = 40;
var B = -10;
var T = 10;
var PIXEL = 2;
var BLACK = '#000000';
var WHITE = '#ffffff';
var RED = '#ff0000';
var GRAY = "#757575";

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const round_up = (n) => Math.ceil(n * 100) / 100;
const round_down = (n) => Math.floor(n * 100) / 100

function r_state(x, y){
    var left_side = y;
    var right_side = x + 1 / 3;
    return round_down(left_side) < round_up(right_side);
}

function r_region(u){
    var ratio_x = Math.floor((R - L) * 100 / W) / 100;
    var ratio_y = Math.floor((T - B) * 100 / H) / 100;
    var l = u[0] * ratio_x + L;
    var r = u[1] * ratio_x + L;
    var b = u[2] * ratio_y + B;
    var t = u[3] * ratio_y + B;
    var state = [false, false];
    state[0] = r_state(l, t);
    state[1] = r_state(r, b);
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
        paint_area(GRAY, [0, W, zero_line, zero_line + PIXEL]);
    }

    if(B <= 0 && T >= 0){
        zero_line = Math.floor(W * (0 - L) / (R - L));
        paint_area(GRAY, [zero_line, zero_line + PIXEL, 0, H]);
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
        repeat = define_color(u[i]);

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
    console.log(i)

}

function define_color(u){
    var state = r_region(u);
    if(state[0] && state[1]){
        paint_area(BLACK, u);
        return false;
    }
    if(state[0] || state[1]){
        paint_area(RED, u);
        return true;
    }
    paint_area(WHITE, u);
    return false;

}






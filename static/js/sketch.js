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

function formula(x, y, form){
    return 5 * Math.sin(x) - 5 * Math.cos(y);
}

function r_state(x, y, left_form, right_form){
    var left_side = formula(x, y, left_form);
    var right_side = formula(x, y, right_form);
    return left_side - right_side > 0;
}

function r_region(u, left_side, right_side){
    var ratio_x = (R - L) / W;
    var ratio_y = (T - B) / H;
    var l = u[0] * ratio_x + L;
    var r = u[1] * ratio_x + L;
    var b = u[2] * ratio_y + B;
    var t = u[3] * ratio_y + B;
    var state = [false, false, false, false];
    state[0] = r_state(l, b, left_side, right_side);
    state[1] = r_state(r, b, left_side, right_side);
    state[2] = r_state(l, t, left_side, right_side);
    state[3] = r_state(r, t, left_side, right_side);
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
    if(L <= 0 && R >= 0){
        zero_line = Math.floor(H * (0 - B) / (T - B));
        paint_area(GRAY, [0, W, zero_line - PIXEL / 2, zero_line + PIXEL / 2]);
    }

    if(B <= 0 && T >= 0){
        zero_line = Math.floor(W * (0 - L) / (R - L));
        paint_area(GRAY, [zero_line - PIXEL / 2, zero_line + PIXEL / 2, 0, H]);
    } 
}

function setup_graph(left_side, right_side, comp){
    graph(left_side, right_side, comp);

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

function graph(left_side, right_side, comp){
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
        repeat = define_color(u[i], left_side, right_side, comp);

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

function define_color(u, left_side, right_side, comp){
    /*
    left side = right side-> 0
    left side > right side -> 1
    left side < right side-> 2
    left side >= right side-> 3
    left side <= right side-> 4
    left side >/< right side-> 5
    */
    var state = r_region(u, left_side, right_side);
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
    var output = analysis(input);
    var error = output[0];
    if(error != 0)
        return 'Try again';

    var left_side =  input.substring(output[1][0], output[1][1]);
    var right_side =  input.substring(output[2][0], output[2][1]);
    var comp =  output[3];
    setup_graph(left_side, right_side, comp);
    return "All Good";
}

function find_comp(input){
    var all_comp = ["=", ">", "<", ">=", "<=", ">/<"];
    var all_places = [input.search("="), input.search(">"), input.search("<"), input.search(">="), input.search("<="), input.search(">/<")];
    var comp = -1;

    if(all_places[0] != -1 && all_places[1] == -1 && all_places[2] == -1 && all_places[3] == -1 && all_places[4] == -1 && all_places[5] == -1)
        comp = 0;
    else if(all_places[0] == -1 && all_places[1] != -1 && all_places[2] == -1 && all_places[3] == -1 && all_places[4] == -1 && all_places[5] == -1)
        comp = 1;
    else if(all_places[0] == -1 && all_places[1] == -1 && all_places[2] != -1 && all_places[3] == -1 && all_places[4] == -1 && all_places[5] == -1)
        comp = 2;
    else if(all_places[0] != -1 && all_places[1] != -1 && all_places[2] == -1 && all_places[3] != -1 && all_places[4] == -1 && all_places[5] == -1 && all_places[0] == all_places[1] + 1 && all_places[1] == all_places[3])
        comp = 3;
    else if(all_places[0] != -1 && all_places[1] == -1 && all_places[2] != -1 && all_places[3] == -1 && all_places[4] != -1 && all_places[5] == -1 && all_places[0] == all_places[2] + 1 && all_places[2] == all_places[4])
        comp = 4;
    else if(all_places[0] == -1 && all_places[1] != -1 && all_places[2] != -1 && all_places[3] == -1 && all_places[4] == -1 && all_places[5] != -1 && all_places[2] == all_places[1] + 2 && all_places[1] == all_places[5])
        comp = 5;

    if(comp == -1) 
        return [["", ""] ,-1];

    var comp_array = input.split(all_comp[comp]);
    if(comp_array.length != 2)
        return [["", ""] ,-1];
    
    if(comp_array[0] == "" || comp_array[1] == "")
        return [["", ""] ,-1];

    var sum_subplaces = comp_array[1].search("=") + comp_array[1].search(">") + comp_array[1].search("<") + comp_array[1].search(">=") + comp_array[1].search("<=") + comp_array[1].search(">/<");
    if(sum_subplaces != -6)
        return [["", ""] ,-1];

    return [comp_array, comp];
}

function analysis(input){
    input = input.replaceAll(' ','');

    var form_info = find_comp(input);
    var left_side = form_info[0][0];
    var right_side = form_info[0][1];
    var comp = form_info[1];
    
    if(comp == -1){
        return [-1, left_side, right_side, comp]
    }
       
    var c = "";
    for(var i = 0; i < input.length; i++){
        c = input[i];
    }

    return [0, left_side, right_side, comp];
}
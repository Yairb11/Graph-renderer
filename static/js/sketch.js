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

function paint_area(c, u){
    var l = u[0];
    var r = u[1];
    var b = H - u[2];
    var t = H - u[3];

    fill(c);
    noStroke();
    rect(l, t, r - l, b- t);
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

function parentheses(form){
    var par = 0;
    var last_par = -1;
    var c = "";
    for(var i = 0; i < form.length; i++){
        c = form[i];
        if(c == "("){
            last_par = i;
            par += 1;
        }
        else if(c == ")"){
            if(last_par == -1 || last_par + 1 == i)
                return 1;
            else{
                par -= 1;
            }
        }
    }
    if(par != 0)
        return false;
    return true;
}

function syntax(form) {
    var token_regex = /^(arcsinh|arccosh|arctanh|sinh|cosh|tanh|abs|sin|cos|tan|arctan|arcsin|arccos|ln|log|sqrt|x|y|e|pi|\d+(\.\d+)?|[\+\-\*\/\^\(\)])+$/;
    if (!token_regex.test(form))
        return false; 

    var func_regex = /(arcsinh|arccosh|arctanh|arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|abs|ln|log|sqrt)(?![h\(])/;
    if (func_regex.test(form))
        return false;

    var dup_regex = /[\+\-\*'\/\^]{2,}/
    if (dup_regex.test(form)) 
        return false; 

    var start_regex = /^[\+\*\/\^]/;
    var end_regex = /[\+\-\*\/\^]$/;
    if (start_regex.test(form) || end_regex.test(form))
        return false;


    var openning_regex = /\([\+\*\/\^]/;
    var closing_regex = /[\+\-\*\/\^]\)/;
    if (openning_regex.test(form) || closing_regex.test(form)) 
        return false;

    var missing_regex = /\d[a-zA-Z(]|\)[a-zA-Z(]|[xye][xye]|[xye]\(|[a-zA-Z)]\d/;
    if (missing_regex.test(form))
        return false; 

    var missing_pi_regex = /\d(pi)|\)(pi)|[xye](pi)|(pi)[xye]|(pi)\(|(pi)\d/;
    if (missing_pi_regex.test(form))
        return false; 
    
    return true;
}

function analysis(input){
    input = input.replaceAll(' ','');
    input = input.toLowerCase();

    var form_info = find_comp(input);
    if(form_info[1] == -1)
        return [-1, "", "", -1];

    var left_side = form_info[0][0];
    var right_side = form_info[0][1];
    var comp = form_info[1];
    if((!parentheses(left_side)) || (!parentheses(right_side)))
        return [-1, "", "", -1];

    if((!syntax(left_side)) || (!syntax(right_side)))
        return [-1, "", "", -1];

    
    console.log(left_side);
    console.log(right_side);
    console.log(["=", ">", "<", ">=", "<=", ">/<"][comp]);

    return [0, left_side, right_side, comp];
}

function formula(x, y, form){
    
    var tokens = [];
    var i = 0;
    var c = "";
    var connection = "";
    while (i < form.length) {
        c = form[i];
        if ('+-*/^()'.includes(c)) {
            if (c == '-' && (tokens.length == 0 || tokens[tokens.length - 1] === '(')) 
                tokens.push('neg'); 
            else 
                tokens.push(c);
            i++;
        } else if ((c >= '0' && c <= '9') || c == '.') {
            connection = "";
            while (i < form.length && ((c >= '0' && c <= '9') || c == '.')) {
                connection = connection + "" + c;
                i++;
                c = form[i];
            }
            tokens.push(parseFloat(connection));
        } else if (c >= 'a' && c <= 'z') {
            connection = "";
            while (i < form.length && c >= 'a' && c <= 'z') {
                connection = connection + "" + c;
                i++;
                c = form[i];
            }
            tokens.push(connection);
        } else 
            i++;
    }
    var output_q = [];
    var op_stack = [];
    var priority = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3, 'neg': 4 };
    var right_associative = { '^': true, 'neg': true };
    var functions = ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'arcsin', 'arccos', 'arctan', 'arcsinh', 'arccosh', 'arctanh', 'abs', 'ln', 'log', 'sqrt'];
    var token;
    var op;
    for (var t = 0; t < tokens.length; t++) {
        token =  tokens[t];
        if (typeof token == 'number' || token == 'x' || token == 'y' || token == 'e' || token == 'pi') 
            output_q.push(token);
        else if (functions.includes(token))
            op_stack.push(token);
        else if (token in priority) {
            while (op_stack.length > 0 && op_stack[op_stack.length - 1] !='(' && (functions.includes(op_stack[op_stack.length - 1]) || priority[op_stack[op_stack.length - 1]] > priority[token] || (priority[op_stack[op_stack.length - 1]] == priority[token] && !right_associative[token])))
                output_q.push(op_stack.pop());
            op_stack.push(token);
        } else if (token == '(')
            op_stack.push(token);
        else if (token == ')') {
            while (op_stack.length > 0 && op_stack[op_stack.length - 1] != '(') 
                output_q.push(op_stack.pop());
            if (op_stack.length == 0) 
                throw new Error("Mismatched parentheses");
            op_stack.pop(); 
        }
    }
    while (op_stack.length > 0) {
        op = op_stack.pop();
        if (op == '(' || op == ')') 
            throw new Error("Mismatched parentheses");
        output_q.push(op);
    }

    var eval_stack = [];
    var value_a, value_b;
    for (var t = 0; t < output_q.length; t++){
        token = output_q[t];
        if (typeof token == 'number') 
            eval_stack.push(token);
        else if (token == 'x')
            eval_stack.push(x);
        else if (token === 'y')
            eval_stack.push(y);
        else if (token === 'e')
            eval_stack.push(Math.E);
        else if (token === 'pi')
            eval_stack.push(Math.PI);
        else if (token === 'neg')
            eval_stack.push(-eval_stack.pop());
        else if (functions.includes(token)) {
            value_a = eval_stack.pop();
            switch (token) {
                case 'sqrt':
                    eval_stack.push(Math.sqrt(value_a)); 
                    break;
                case 'ln':
                    eval_stack.push(Math.log(value_a)); 
                    break;
                case 'log':
                    eval_stack.push(Math.log10(value_a)); 
                    break;
                case 'sin':
                    eval_stack.push(Math.sin(value_a)); 
                    break;
                case 'cos': 
                    eval_stack.push(Math.cos(value_a)); 
                    break;
                case 'tan':
                    eval_stack.push(Math.tan(value_a));
                    break;
                case 'sinh':
                    eval_stack.push(Math.sinh(value_a));
                    break;
                case 'cosh':
                    eval_stack.push(Math.cosh(value_a));
                    break;
                case 'tanh':
                    eval_stack.push(Math.tanh(value_a));
                    break;
                case 'arcsin':
                    eval_stack.push(Math.asin(value_a));
                    break;
                case 'arccos':
                    eval_stack.push(Math.acos(value_a));
                    break;
                case 'arctan':
                    eval_stack.push(Math.atan(value_a));
                    break;
                case 'arcsinh':
                    eval_stack.push(Math.asinh(value_a));
                    break;
                case 'arccosh':
                    eval_stack.push(Math.acosh(value_a));
                    break;
                case 'arctanh':
                    eval_stack.push(Math.atanh(value_a)); 
                    break;
                case 'abs':
                    eval_stack.push(Math.abs(value_a));
                    break;
            }
        }else{
            value_b = eval_stack.pop();
            value_a = eval_stack.pop();
            switch (token) {
                case '+':
                    eval_stack.push(value_a + value_b);
                    break;
                case '-':
                    eval_stack.push(value_a - value_b);
                    break;
                case '*':
                    eval_stack.push(value_a * value_b);
                    break;
                case '/':
                    eval_stack.push(value_a / value_b);
                    break;
                case '^':
                    eval_stack.push(Math.pow(value_a, value_b));
                    break;
            }
        }
    }
    return eval_stack[0];
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

function create_graph(input, user_l, user_r, user_b, user_t){
    var output = analysis(input);
    var error = output[0];
    if(error != 0)
        return 'Try again';

    var left_side =  output[1];
    var right_side =  output[2];
    var comp =  output[3];

    L = user_l;
    R = user_r;
    B = user_b;
    T = user_t;

    setup_graph(left_side, right_side, comp);
    return "All Good";
}



Graph renderer with 2 free variables xy 
Like Desmos from scratch  
Containt basic math operations: + - * / and ^
Contains the functions: abs() ln() log() sqrt()
Containts the trigo functions: sin() cos() tan() arcsin() arccos() arctan()
Containts the hyperbolic trigo functions: sinh() cosh() tanh() arcsinh() arccosh() arctanh()
Contains known constants e and pi.
Also, the users formula could be with any of the 6 different comparisons: = > < >= <= >/<

Most of the project is writen in javascript with a little html as an basic UI on top of a small python server with flask that uses port 8000 on the localhost

The input is processed using 3 steps:
1) Analyzing, where we check the type of comparison, divide to two different formulas(left side and right side), and checking syntax errors
2) Tokenizing, divide it to chunks so we could perform the calculation of all the operations and the different functions
3) Performing the Shunting Yard Algorithm on the input formula.

For the graph itself, I used the paper Reliable Two Dimensional Graphing Methods For Mathematival Formulae With Two Free Variables by Jeff Tupper
https://www.dgp.toronto.edu/~mooncake/papers/SIGGRAPH2001_Tupper.pdf
For the painting of the graph, i used the p5 js library for javascript.

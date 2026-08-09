# Graph renderer with 2 free variables xy
## Quick Summery
p5.js Javascript Desmos like project that runs on Flask python as a backend.
Renders graph with 2 free variables XY and with some additional useful math functions and constants
I used `Reliable Two Dimensional Graphing Methods For Mathematival Formulae With Two Free Variables by Jeff Tupper` paper with Shunting Yard Algorithm on users input.

## Built From
> **Reliable Two-Dimensional Graphing Methods for Mathematical Formulae with Two Free Variables**
> Jeff Tupper, SIGGRAPH 2001
> https://www.dgp.toronto.edu/~mooncake/papers/SIGGRAPH2001_Tupper.pdf

The whole renderer is built on this paper. The recursive subdivision described in
[Plotting Process](#plotting-process) is the method it presents, and it is what makes the graph
both precise and fast enough to draw in the browser.

## Install and Use
> **This project is built with [`uv`](https://docs.astral.sh/uv/), and `uv` is the recommended way to run it.**
> `pyproject.toml` and `uv.lock` are the source of truth for the dependencies, and
> `requirements.txt` is just an export generated from them. The plain `pip` steps below are there
> for the basic use case, if you do not have `uv`.

1. Clone this repo
2. Create a virtual environment:
```bash
python -m venv .venv
```
3. Activate it:
```bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```
4. Install all `requirements.txt`:
```bash
pip install -r requirements.txt
```
5. Run `main.py`:
```bash
python main.py
```
6. Play with it in `http://127.0.0.1:5000`

### Using uv (recommended)
1. Sync the environment:
```bash
uv sync
```
2. Run `main.py`:
```bash
uv run python main.py
```
Or through the Flask CLI:
```bash
uv run flask --app main run
```

## Project Structure
### Backend
| File | Responsibility |
|---|---|
| `main.py` | Entry point, starts the development server |
| `app.py` | `create_app()` factory that builds and configures Flask |
| `routes.py` | The `graph` blueprint serving `/` and `/graph` |
| `config.py` | Host, port, debug flag and the template/static directories |

### Frontend
| File | Responsibility |
|---|---|
| `static/js/config.js` | Canvas size, viewport bounds, colors, comparison kinds, function names |
| `static/js/validator.js` | Splits the equation and rejects malformed syntax |
| `static/js/tokenizer.js` | Shunting Yard conversion into reverse polish notation |
| `static/js/evaluator.js` | Stack machine that evaluates an expression at a point |
| `static/js/renderer.js` | Axes, region colors and the recursive subdivision |
| `static/js/sketch.js` | p5.js entry point and the `createGraph()` API |
| `static/js/ui.js` | Reads the form, shows errors, captions the canvas |
| `static/styles/style.css` | Page styling |
| `templates/graph.html` | Page markup |

## Operations
This desmos like renderer can understand some operations, function and constants:
1) Basic math operations: + - * / and ^
2) Functions: abs() ln() log() sqrt()
3) Trigo functions: sin() cos() tan() arcsin() arccos() arctan()
4) Hyperbolic trigo functions: sinh() cosh() tanh() arcsinh() arccosh() arctanh()
5) Known constants e and pi.
6) Different comparisons: = > < >= <= >/<

## Plotting Process
### Compiling the Input
**Making the program understand users input.**
**The input runs into this process:**
1. **Syntax Errors**: It checks syntax error of the main equation
2. **Divides**: It divides the main equation into 2 sides, left and right. In addition, gets the comparison between them
3. **Tokenizing**: It divides each side of the equation into chanks for the math symbols
4. **Shunting Yard Algorithm**: It calculates with the known x,y each side of the equation using the tokenized form of each side of the main equation.

**Now we have input output process with x,y and main function as an input and output as boolean object that represents if the main equation is true with this given variables.**

### The Problem
We cant plot each x,y point to check for them, it would take a lot of time. So we need some computation trick for this.

### The Solution: Recursive Subdivision
For this, the paper by `Jeff Tupper` from [Built From](#built-from) comes in handy.

### How it Works
1. **initial Division**: The graphing space divided into 4 initial blocks
2. **Corner Evaluation**: For each block, the algorithm evaluates bollean output at its four corners
3. **Intersection Detection**: If there is a variance in the corner outputs (e.g., one corner evaluates to `True` while another evaluates to `False`), it guarantees that the graph's boundary passes through this specific block.
4. **Recursive Precision**: When a boundary is detected, that block is subdivided into 4 smaller blocks, and the corner evaluation process repeats.
5. **Optimization:** Blocks where all corners return the same value are ignored, leaving empty areas untouched.

### Result
By recursively mapping only the bounds of the equation in increasing detail, we achieve a highly precise graph rendering system that runs exceptionally fast.

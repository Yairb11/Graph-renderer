from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get('/', response_class=HTMLResponse)
@app.get('/graph', response_class=HTMLResponse)
def run_graph(request: Request):
    """Runs the template"""
    return templates.TemplateResponse(
        request=request, name="graph.html"
    )

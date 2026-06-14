from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
@app.route('/graph')
def index():
    #opening the html, css and js file when opening this port (.../ or .../graph)
    return render_template("graph.html")

if __name__ == "__main__":
    #Creating local server on port 8000
    app.run(host = "0.0.0.0", port = 8000)
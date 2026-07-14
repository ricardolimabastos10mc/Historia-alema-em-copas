from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/halldaslendas")
def halldaslendas():
    return render_template("halldaslendas.html")

@app.route("/book")
def book():
    return render_template("book.html")

@app.route("/criadores")
def criadores():
    return render_template("criadores.html")

if __name__ == "__main__":
    app.run(debug=True)

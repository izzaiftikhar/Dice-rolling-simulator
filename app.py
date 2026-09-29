import random

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


def roll_dice():
    """Roll a single six-sided die."""
    return random.randint(1, 6)


def get_statistics(rolls):
    """Return summary statistics for a list of roll totals."""
    if not rolls:
        return {"count": 0, "highest": 0, "lowest": 0, "average": 0}
    return {
        "count": len(rolls),
        "highest": max(rolls),
        "lowest": min(rolls),
        "average": round(sum(rolls) / len(rolls), 2),
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/roll", methods=["POST"])
def roll():
    die1, die2 = roll_dice(), roll_dice()
    return jsonify(die1=die1, die2=die2, total=die1 + die2)


@app.route("/api/stats", methods=["POST"])
def stats():
    data = request.get_json(silent=True) or {}
    rolls = [
        r for r in data.get("rolls", [])
        if isinstance(r, int) and 2 <= r <= 12
    ]
    return jsonify(get_statistics(rolls))


if __name__ == "__main__":
    app.run(debug=True)
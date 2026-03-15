from flask import Flask, request, send_file
import subprocess
import os

app = Flask(__name__)

@app.route("/compile", methods=["POST"])
def compile():

    code = request.json["code"]

    os.makedirs("sketch", exist_ok=True)

    with open("sketch/sketch.ino","w") as f:
        f.write(code)

    subprocess.run([
        "arduino-cli",
        "compile",
        "--fqbn",
        "esp32:esp32:esp32",
        "sketch"
    ])

    firmware = "sketch/build/esp32.esp32.esp32/sketch.ino.bin"

    return send_file(
        firmware,
        mimetype="application/octet-stream"
    )

app.run(port=5000)

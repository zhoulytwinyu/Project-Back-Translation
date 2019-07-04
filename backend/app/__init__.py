#!/usr/bin/env python
from flask import Flask, request, jsonify
from backtranslate import backTranslate
app = Flask(__name__)

@app.route("/api/backtranslate",methods=["POST"])
def routeBackTranslate():
  # We require setting Content-Type to application/json
  if "Content-Type" not in request.headers or \
     request.headers["Content-Type"]!="application/json":
    return jsonify({"error":"Content-Type is not specified as application/json"}),400
  # We require actual json in request body
  if not request.get_json(silent=True):
    return jsonify({"error":"JSON required"}),400
  # With a valid json as input, we try running backTranslate on
  #  SEQUENCE, GC_LOWER_BOUND, GC_UPPER_BOUND.
  #  Errors will be caught and reported in json format
  try:
    sequence = request.json.get("SEQUENCE")
    GCLowerBound = request.json.get("GC_LOWER_BOUND")
    GCUpperBound = request.json.get("GC_UPPER_BOUND")
    codonSequence = backTranslate(sequence,GCLowerBound,GCUpperBound)
    GCContent = "To be implemented"
    return jsonify({"CODON_SEQUENCE":codonSequence,
                    "GC_CONTENT":GCContent
                    })
  except Exception as e:
    return jsonify({"error":str(e)}),400

if __name__ == "__main__":
  app.run(host='0.0.0.0')

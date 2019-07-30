#!/usr/bin/env python
from flask import Flask, request, jsonify
from backtranslate import back_translate,validate_amino_acid_sequence,get_gc_min,get_gc_max,get_gc_content
import sqlite3

DB_FILE = "/tmp/app.sqlite3"

def initialize_database(db_file):
  conn = sqlite3.connect(db_file)
  cursor = conn.cursor()
  cursor.execute(initialize_database.CREATE_AASEQ_SQL)
  cursor.execute(initialize_database.CREATE_NTSEQ_SQL)
  cursor.execute(initialize_database.CREATE_AAANDNT_SQL)
  conn.commit()
  conn.close()

# function static variables
initialize_database.CREATE_AASEQ_SQL = \
"""
CREATE TABLE IF NOT EXISTS AMINO_ACID(
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  SEQUENCE VARCHAR NOT NULL UNIQUE,
  GC_MIN DOUBLE,
  GC_MAX DOUBLE
);
"""
initialize_database.CREATE_NTSEQ_SQL = \
"""
CREATE TABLE IF NOT EXISTS NUCLEOTIDE(
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  SEQUENCE VARCHAR NOT NULL UNIQUE,
  GC_CONTENT DOUBLE
);
"""
initialize_database.CREATE_AAANDNT_SQL = \
"""
CREATE TABLE IF NOT EXISTS AMINO_ACID_AND_NUCLEOTIDE(
  AA_ID INTEGER,
  NT_ID VARCHAR,
  FOREIGN KEY(AA_ID) REFERENCES AMINO_ACID(ID),
  FOREIGN KEY(NT_ID) REFERENCES NUCLEOTIDE(ID),
  UNIQUE(AA_ID,NT_ID)
);
"""

def get_db_connection(db_file):
  conn = sqlite3.connect(db_file)
  conn.row_factory = sqlite3.Row
  return conn

def get_or_create_amino_acid(conn,aa_seq):
  cursor = conn.cursor()
  cursor.execute(get_or_create_amino_acid.GET_AMINO_ACID_SQL,(aa_seq,))
  aa_row = cursor.fetchone()
  if aa_row is None:
    gc_min = get_gc_min(aa_seq)
    gc_max = get_gc_max(aa_seq)
    cursor.execute(get_or_create_amino_acid.CREATE_AMINO_ACID_SQL,(aa_seq,gc_min,gc_max))
    conn.commit()
    cursor.execute(get_or_create_amino_acid.GET_AMINO_ACID_SQL,(aa_seq,))
    aa_row = cursor.fetchone()
  cursor.execute(get_or_create_amino_acid.GET_NUCLEOTIDE_SQL,(aa_seq,))
  nt_rows = cursor.fetchall()
  ret = {}
  ret["AMINO_ACID"] = dict(aa_row)
  ret["NUCLEOTIDE_LIST"] = list( map(dict,nt_rows) )
  return ret
  
get_or_create_amino_acid.GET_AMINO_ACID_SQL = \
"""
SELECT ID,SEQUENCE,GC_MIN,GC_MAX
FROM AMINO_ACID
WHERE SEQUENCE = ?
"""
get_or_create_amino_acid.GET_NUCLEOTIDE_SQL = \
"""
SELECT NUCLEOTIDE.ID,NUCLEOTIDE.SEQUENCE,NUCLEOTIDE.GC_CONTENT
FROM AMINO_ACID
  JOIN AMINO_ACID_AND_NUCLEOTIDE
    ON AMINO_ACID.ID=AMINO_ACID_AND_NUCLEOTIDE.AA_ID
  JOIN NUCLEOTIDE
    ON AMINO_ACID_AND_NUCLEOTIDE.NT_ID=NUCLEOTIDE.ID
WHERE AMINO_ACID.SEQUENCE = ?
"""
get_or_create_amino_acid.CREATE_AMINO_ACID_SQL = \
"""
INSERT INTO AMINO_ACID
(SEQUENCE, GC_MIN, GC_MAX)
VALUES
(?,?,?)
"""

def create_and_get_nucleotides_by_back_translation(conn,aa_seq,gc_filter_min,gc_filter_max):
  cursor = conn.cursor()
  cursor.execute(create_and_get_nucleotides_by_back_translation.CHECK_AMINO_ACID_SQL,(aa_seq,))
  assert( cursor.fetchone()["PRESENCE"]>0 )
  codons = back_translate(aa_seq,gc_filter_min,gc_filter_max)
  nt_seq = ''.join(codons)
  gc_content = get_gc_content(nt_seq)
  cursor.execute(create_and_get_nucleotides_by_back_translation.INSERT_NUCLEOTIDE_SQL,(nt_seq,gc_content))
  cursor.execute(create_and_get_nucleotides_by_back_translation.INSERT_AMINO_ACID_AND_NUCLEOTIDE_SQL,(aa_seq,nt_seq))
  conn.commit()
  cursor.execute(create_and_get_nucleotides_by_back_translation.GET_NUCLEOTIDE_SQL,(aa_seq,))
  ret = list( map(dict,cursor.fetchall()) )
  return ret

create_and_get_nucleotides_by_back_translation.CHECK_AMINO_ACID_SQL = \
"""
SELECT COUNT(*) AS PRESENCE
FROM AMINO_ACID
WHERE SEQUENCE=?
"""

create_and_get_nucleotides_by_back_translation.INSERT_AMINO_ACID_AND_NUCLEOTIDE_SQL = \
"""
INSERT OR IGNORE INTO AMINO_ACID_AND_NUCLEOTIDE
(AA_ID,NT_ID)
SELECT AMINO_ACID.ID, NUCLEOTIDE.ID
FROM AMINO_ACID JOIN NUCLEOTIDE
WHERE AMINO_ACID.SEQUENCE=?
  AND NUCLEOTIDE.SEQUENCE=?
"""

create_and_get_nucleotides_by_back_translation.INSERT_NUCLEOTIDE_SQL = \
"""
INSERT OR IGNORE INTO NUCLEOTIDE
(SEQUENCE,GC_CONTENT)
VALUES
(?, ?)
"""

create_and_get_nucleotides_by_back_translation.GET_NUCLEOTIDE_SQL = \
"""
SELECT NUCLEOTIDE.ID,NUCLEOTIDE.SEQUENCE,NUCLEOTIDE.GC_CONTENT
FROM AMINO_ACID
  JOIN AMINO_ACID_AND_NUCLEOTIDE
    ON AMINO_ACID.ID=AMINO_ACID_AND_NUCLEOTIDE.AA_ID
  JOIN NUCLEOTIDE
    ON AMINO_ACID_AND_NUCLEOTIDE.NT_ID=NUCLEOTIDE.ID
WHERE AMINO_ACID.SEQUENCE = ?
"""

def create_application():
  initialize_database(DB_FILE)
  
  app = Flask(__name__)

  @app.route("/api/aminoacid",methods=["POST"])
  def route_aminoacid():
    # We require Content-Type set to application/json
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
      aa_seq = request.json.get("AMINO_ACID_SEQUENCE")
      assert( validate_amino_acid_sequence(aa_seq) )
      conn = get_db_connection(DB_FILE)
      aa = get_or_create_amino_acid(conn,aa_seq)
      return jsonify(aa)
    except Exception as e:
      return jsonify({"error":str(e)}),400

  @app.route("/api/backtranslate",methods=["POST"])
  def route_backtranslate():
    # We require Content-Type set to application/json
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
      aa_seq = request.json.get("AMINO_ACID_SEQUENCE")
      gc_filter_min = request.json.get("GC_FILTER_MIN")
      gc_filter_max = request.json.get("GC_FILTER_MAX")
      assert( validate_amino_acid_sequence(aa_seq) )
      assert( type(gc_filter_min)==float or type(gc_filter_min)==int )
      assert( type(gc_filter_max)==float or type(gc_filter_max)==int )
      conn = get_db_connection(DB_FILE)
      nt_list = create_and_get_nucleotides_by_back_translation(conn,aa_seq,gc_filter_min,gc_filter_max)
      return jsonify({"NUCLEOTIDE_LIST":nt_list
                      })
    except Exception as e:
      return jsonify({"error":str(e)}),400
  return app

if __name__ == "__main__":
  app = create_application()
  app.run(host='0.0.0.0',port=5000)

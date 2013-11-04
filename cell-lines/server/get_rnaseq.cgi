#!/usr/bin/python
import json
import cgi
import sqlite3 as lite
import datetime
import sys
import urllib

qform = cgi.FieldStorage()
parameter = "reference = %27GC%27 AND chromosome = %27chr1%27"#qform.getvalue('parameter')
parameter = "fpkm%20%3E%20100"
function = "advanced"
parameter = qform.getvalue('parameter')
function = qform.getvalue('column')
conn = None

try:
    #print "start " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #conn = sqlite3.connect('./sqlite/' + organism + '_ref.db')
    #conn.text_factory = str
    #c = conn.cursor()
    con = lite.connect('sqlite/snv_indel_shsy.db')
    con.text_factory = str
    cur = con.cursor()
    fields = 'id, name, locus, fpkm, fpkm_conf_lo, fpkm_conf_high, tss'
    sql = 'select ' + fields + ' from rnaseq limit 500'
    #p_query = "select * from mytable where name_field = ?";
    #mDb.rawQuery(p_query, new String[] { uvalue });
    if (parameter != None):
      sql = "select " + fields + " from rnaseq where %s like '%s%s%s' limit 500" %(function, "%",parameter,"%")
      if (function != None and function == "advanced"):
	  mywhere = urllib.unquote(parameter)
	  sql = "select " + fields + " from rnaseq where %s limit 500" %(mywhere)	
    cur.execute(sql)
    #'select chromosome, begin, end, var_type, reference, allele_seq, xref, complete_genomics, illumina from snv_indel_shsy limit 200')
    rows = cur.fetchall()
    print "Content-type: text/html;charset=utf-8\r\n"
    pa = {}
    pa['aaData'] = []
    for row in rows:
        pi = []
        for r in range(len(row)):
            pi.append(row[r])
        pa['aaData'].append(pi)
    print json.dumps(pa)
    #print sql
except lite.Error, e:
    print "Error %s:" % e.args[0]
    sys.exit(1)


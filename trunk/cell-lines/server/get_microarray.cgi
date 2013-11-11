#!/usr/bin/python
import json
import cgi
import sqlite3 as lite
import datetime
import sys
import urllib

qform = cgi.FieldStorage()
parameter = qform.getvalue('parameter')
function = qform.getvalue('function')
conn = None

try:
    con = lite.connect('sqlite/snv_indel_shsy.db')
    con.text_factory = str
    cur = con.cursor()
    fields = 'name, anno, expressed'
    sql = 'select ' + fields + ' from microarray_gsm_expressed order by name asc limit 200'
    if (parameter != None):
      sql = "select " + fields + " from microarray_gsm_expressed where %s like '%s'" %(function, "%"+parameter+"%")
      if (function != None and function == "advanced"):
         mywhere = urllib.unquote(parameter)
	 sql = "select " + fields + " from microarray_gsm_expressed  where %s" %(mywhere)
    cur.execute(sql)
    rows = cur.fetchall()
    print "Content-type: text/html;charset=utf-8\r\n"
    pa = {}
    pa['aaData'] = []
    for row in rows:
        pi = []
        for r in range(len(row)):
	    #&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102825' target='_blank'>GSM102825</a>
	    if (r == len(row) -1):
	      gsms = row[r]
	      gtk = gsms.split(" ")
	      gsmlinks = ""
	      for g in gtk:
	        gsmlinks = gsmlinks + "&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=%s' target='_blank'>%s</a>" %(g, g)
	      pi.append(gsmlinks)
	    else:
	      pi.append(row[r])
        pa['aaData'].append(pi)
    print json.dumps(pa)
except lite.Error, e:
    print "Error %s:" % e.args[0]
    sys.exit(1)


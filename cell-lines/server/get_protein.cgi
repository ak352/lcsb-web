#!/usr/bin/python
import json
import cgi
import sqlite3 as lite
import datetime
import sys

qform = cgi.FieldStorage()
conn = None

try:
    #print "start " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #conn = sqlite3.connect('./sqlite/' + organism + '_ref.db')
    #conn.text_factory = str
    #c = conn.cursor()
    con = lite.connect('sqlite/snv_indel_shsy.db')
    con.text_factory = str
    cur = con.cursor()
    cur.execute('select id, name, alias, abundance from protein')
    rows = cur.fetchall()
    print "Content-type: text/html;charset=utf-8\r\n"
    pa = {}
    pa['aaData'] = []
    for row in rows:
        pi = []
        for r in range(len(row)):
	    if (r == 0):
		pid = row[0]
		if (pid[0:2] == "uc"):
	            pi.append("<a href='http://genome.ucsc.edu/cgi-bin/hgGene?hgg_gene=%s' target='_blank'>%s UCSC</a>" %(row[0], row[0]))
		else:
		    pi.append("<a href='http://www.proteinatlas.org/%s' target='_blank'>%s Human Protein Atlas</a>" %(row[0], row[0])) 
	    else:
	        pi.append(row[r])
        pa['aaData'].append(pi)
    print json.dumps(pa)

except lite.Error, e:
    print "Error %s:" % e.args[0]
    sys.exit(1)


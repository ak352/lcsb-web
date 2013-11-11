#!/usr/bin/python
import json
import cgi
import sqlite3 as lite
import datetime
import sys

qform = cgi.FieldStorage()
#organism = "human"
organism = qform.getvalue('organism')
#fileName = "test.sif"
fileName = qform.getvalue('fileName')
conn = None

try:
    #print "start " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #conn = sqlite3.connect('./sqlite/' + organism + '_ref.db')
    #conn.text_factory = str
    #c = conn.cursor()
    con = lite.connect('sqlite/snv_indel_shsy.db')
    con.text_factory = str
    cur = con.cursor()
    cur.execute('select chr, begin, end, name, avg_normalized_cvg, relative_cvg, called_level, level_score from cnv_segments order by avg_normalized_cvg asc')
    rows = cur.fetchall()
    print "Content-type: text/html;charset=utf-8\r\n"
    pa = {}
    pa['aaData'] = []
    for row in rows:
        pi = []
        for r in range(len(row)):
            pi.append(row[r])
	    #if (r == len(row)-1):
	    #  pi.append("<a href='http://www.genome.jp/dbget-bin/www_bget?cpd:%s' target='_blank'><img src='http://www.genome.jp/Fig/compound/%s.gif'/></a>" %(row[1], row[1]))		
        pa['aaData'].append(pi)
    print json.dumps(pa)

except lite.Error, e:
    print "Error %s:" % e.args[0]
    sys.exit(1)


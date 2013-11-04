#!/usr/bin/python
import json
import cgi
import sqlite3 as lite
import datetime
import sys

qform = cgi.FieldStorage()
parameter = qform.getvalue('parameter')
conn = None

try:
    #print "start " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #conn = sqlite3.connect('./sqlite/' + organism + '_ref.db')
    #conn.text_factory = str
    #c = conn.cursor()
    con = lite.connect('sqlite/snv_indel_shsy.db')
    con.text_factory = str
    cur = con.cursor()
    sql = 'select chr1, position1, length1, chr2, position2, length2, stv_type, frequency, assembled_sequence from structural_variation' 
    if (parameter != None):
        lowfq = parameter.split(":")[0]
        hifq = parameter.split(":")[1]
        sql = "select chr1, position1, length1, chr2, position2, length2, stv_type, frequency, assembled_sequence from structural_variation where frequency >= %s and frequency <= %s order by frequency desc" %(lowfq, hifq)

    cur.execute(sql)
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

except lite.Error, e:
    print "Error %s:" % e.args[0]
    sys.exit(1)


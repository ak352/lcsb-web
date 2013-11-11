#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys

con = None

try:
    con = lite.connect('sqlite/snv_indel_shsy.db')
    
    cur = con.cursor()    
    cur.execute('SELECT SQLITE_VERSION()')
    
    data = cur.fetchone()
    
    print "SQLite version: %s" % data                

    cur.execute('select variant_id, chromosome from snv_indel_shsy where variant_id > 1000 and variant_id < 1200 and passed = "Y" limit 10')
    rows = cur.fetchall()
    for row in rows:
        print row
    cur.execute('select count(variant_id) from snv_indel_shsy where passed = "Y"')
    row_ct = cur.fetchone() 
    print "Passed Count %i" %(row_ct)
    
    cur.execute('select * from metabolomic limit 10')
    print "metabolomic"
    rows = cur.fetchall()
    for row in rows:
        print row

    cur.execute('select * from cnv_segments limit 10')
    print "cnv_segments"
    rows = cur.fetchall()
    for row in rows:
	print row

    cur.execute('select * from structural_variation limit 10')
    print "stv"
    rows = cur.fetchall()
    for row in rows:
	print row
except lite.Error, e:
    
    print "Error %s:" % e.args[0]
    sys.exit(1)
    
finally:
    
    if con:
        con.close()

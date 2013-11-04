#!/usr/bin/python
import json
import cgi
import sqlite3 as lite
import datetime
import sys
import urllib

qform = cgi.FieldStorage()
parameter = "reference = %27GC%27 AND chromosome = %27chr1%27"#qform.getvalue('parameter')
parameter = "allele_Seq%20%3D%20%27T%27%20or%20allele_Seq%20%3D%20%27A%27"
function = "advanced"
parameter = qform.getvalue('parameter')
function = qform.getvalue('column')

#allele%20%3D%20%27A%27%20AND%20reference%20%3D%20%27G%27
conn = None

try:
    #print "start " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #conn = sqlite3.connect('./sqlite/' + organism + '_ref.db')
    #conn.text_factory = str
    #c = conn.cursor()
    con = lite.connect('sqlite/snv_indel_shsy.db')
    con.text_factory = str
    cur = con.cursor()
    fields = 'chromosome, begin, end, var_type, reference, allele_seq, complete_genomics, illumina, xref'
    #chromosome text, begin integer, end integer, var_type text, reference text, allele_seq text, xref text, complete_genomics text, illumina text, passed text
    sql = 'select ' + fields + ' from snv_indel_shsy limit 500'
    #p_query = "select * from mytable where name_field = ?";
    #mDb.rawQuery(p_query, new String[] { uvalue });
    if (parameter != None):
      sql = "select " + fields + " from snv_indel_shsy where %s like '%s%s%s' limit 500" %(function, "%",parameter,"%")
      if (function != None and function == "advanced"):
	  mywhere = urllib.unquote(parameter)
	  """andtokens = []
	  mywhere = ""
	  if (parameter.find(" AND ") != -1):
	      andtokens = parameter.split(" AND ")
	  ortokens = []
	  if (parameter.find(" OR ") != -1):
	      ortokens = parameter.split(" OR ")
	  if (len(andtokens) == 0 and len(ortokens) == 0):
	      mytk = parameter.split(" ")
	      mywhere = mytk[0] + " " + mytk[1] + " '" + mytk[2] + "'" 
	  else:
	      paramter = parameter + "'"
	      if (len(andtokens) > 1):
	          for aa in andtokens:
		      sp = " = "
		      quote = "'"
		      endquote = "'"
		      if (aa.find(" LIKE ") != -1):
		          sp = " LIKE "
			  quote = "'%"
			  endquote = "%'"
	              sptk = aa.split(sp)
		      mywhere = mywhere + " " + sptk[0] + sp + quote + sptk[1] + endquote + " AND "
	          mywhere = mywhere[0:len(mywhere)-5]
	      if (len(ortokens) > 1):
                  for aa in ortokens:
                      sp = " = "
                      if (aa.find(" LIKE ") != -1):
                          sp = " LIKE "
			  quote = "'%"
			  endquote = "%'"
                      sptk = aa.split(sp)
                      mywhere = mywhere + " " + sptk[0] + sp + quote + sptk[1] + endquote + " OR "
                  mywhere = mywhere[0:len(mywhere)-4]	  
	      #mywhere = parameter.replace(" = ", " = '")
              #mywhere = parameter.replace(" AND ", "' AND")
	  #print mywhere """
	  sql = "select " + fields + " from snv_indel_shsy where %s limit 500" %(mywhere)	
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


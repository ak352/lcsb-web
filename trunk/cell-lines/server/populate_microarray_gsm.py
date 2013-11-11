import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

#>chr    begin   end     avgNormalizedCvg        relativeCvg     calledLevel     calledCNVType   levelScore      CNVTypeScore


# Create table
c.execute('DROP TABLE IF EXISTS microarray_gsm_expressed')
c.execute('''create table microarray_gsm_expressed
    (name text, anno text, expressed text,  alias text
    )''')

fin = open ("ncbi_homosap.tsv", "r")
nh = {}
for f in fin.readlines():
  tk = f.strip().split("\t")
  #print len(tk)
  #print tk
  nh[tk[1]] = {"name":tk[2], "anno":tk[8], "alias":tk[0] + " " + tk[5]}
  #break
fin.close()

noinfo = []
f1in = open("microarray/SHsy5y_expressed.txt", "r")
fout = open("microarray/transformed_SHsy5y_expressed.tsv", "w")
lc = 0
headers = []
for f in f1in.readlines():
  tk = f.strip().split("\t")
  if (lc == 0):
    headers = tk
    lc = lc + 1
    print len(tk)
    continue
  else:
    ncbi = tk[0]
    nobj = nh.get(ncbi)
    pa = []
    if (nobj != None):
      pa.append(nobj["name"])
      pa.append(nobj["anno"])
      fout.write(nobj["name"] + "\t" + nobj["anno"] + "\t" + nobj["alias"])
      expressed = ""
      for gsm in range(1, len(tk)):
	  if (tk[gsm] == "1" and headers[gsm].find("GS") != -1):
	    expressed = expressed + " " + headers[gsm]
	    fout.write("\t" + headers[gsm])
      fout.write("\n")	    
      pa.append(expressed)
      pa.append(nobj["alias"])
      c.execute("""insert into microarray_gsm_expressed
		values (?,?,?,?)""", pa)
    else:
      noinfo.append(ncbi)
      #print "no info for ncbi " + ncbi
   #print len(tk)
        #print tk
	    #break
print len(noinfo)
#print noinfo
f1in.close()
fout.close()
c.close()
conn.commit()
conn.close()

import sys
import sqlite3
import time

from time import gmtime, strftime
print strftime("%Y-%m-%d %H:%M:%S", gmtime())
ref = sys.argv[1]
init = sys.argv[2]
conn = sqlite3.connect('./sqlite/all_ref.db')
fin = open("./data/mart_export_" + ref + ".txt", "r")
c = conn.cursor()
"""
Ensembl Gene ID Gene Start (bp) Gene End (bp)   Chromosome Name Description     EntrezGene ID   RefSeq mRNA [e.g. NM_001195597] UniProt Gene Name
ENSMUSG00000097066      65780905        65867305        13
ENSMUSG00000097374      57459572        57461553        19
"""

if (init == "1"):
	c.execute('DROP TABLE IF EXISTS all_ref')
	c.execute('''CREATE TABLE all_ref
             (ref text, ensn text collate nocase, entr text collate nocase, rfsq text collate nocase, gene_name text collate nocase, chr text, start text, end text)''')

"""
human
Ensembl Gene ID Chromosome Name Gene Start (bp) Gene End (bp)   RefSeq mRNA [e.g. NM_001195597] EntrezGene ID   HGNC symbol
ENSG00000141510 17      7565097 7590856 NM_001126114    7157    TP53
ENSG00000141510 17      7565097 7590856 NM_001126113    7157    TP53

EG      ECK     Gene    LeftEnd RightEnd        JW
"""

org_chr_names = {"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1, "17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"X":1,"Y":1,"2L":1,"2R":1,"3L":1,"3R":1,"I":1,"II":1,"III":1,"IV":1,"V":1,"VI":1,"VII":1,"VIII":1,"IX":1,"X":1,"XI":1,"XII":1,"XIII":1,"XIV":1,"XV":1,"XVI":1,"MT":1,"k-12":1,"K-12":1}

lc = 0
ec = 0
for line in fin.readlines():
	if (lc == 0):
		#print line + " " + str(len(line.split("\t")))
		lc += 1
		continue
	line = line.upper()
	line = line.replace("'", "")
	tk = line.strip().split("\t")
	#tk[4] .. 7 needs to be optional
	entr = None
	rfsq = None
	gene_name = ""
	chr = tk[3]
	start = tk[1]
	end = tk[2] 
	ensb = tk[0]
	if (ref == "mouse"):
		if (len(tk) >= 6):
			entr = tk[5]
		if (len(tk) >= 7):
			rfsq = tk[6]
		if (len(tk) >= 8):
			gene_name = tk[7]
	elif (ref == "ecoli"):
		ensb = tk[0]
		entr = tk[1]
		gene_name = tk[2]
		start = tk[3]
		end = tk[4]
		chr = "k-12"
		rfsq = tk[5]
	else:
		chr = tk[1]
		start = tk[2]
		end = tk[3]
		ensb = tk[0]
		if (len(tk) >= 7):
			gene_name = tk[6]
			#print gene_name
			entr = tk[5]
			rfsq = tk[4]
		else:
			gene_name = tk[-1]
			entr = tk[-2]
	if (org_chr_names.get(chr.upper()) == None):
		ec = ec + 1
		continue
	try:
		c.execute("INSERT INTO %s VALUES ('%s','%s','%s','%s','%s','%s','%s','%s')" %("all_ref", ref, ensb, entr, rfsq, gene_name.replace("'",""), chr, start, end))
		#print ensb + " " + gene_name
	except sqlite3.Error, e:
		print "ERROR INSERT INTO %s VALUES ('%s','%s','%s','%s','%s','%s','%s')" %(ref+"_ref", ensb, entr, rfsq, gene_name, chr, start, end)
		continue
	lc += 1
fin.close()		

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
print ref + " - inserted " + str(lc) + " excluded cuz of chr name " + str(ec)
print strftime("%Y-%m-%d %H:%M:%S", gmtime())

import sys
import sqlite3
import os

ref = sys.argv[1]

print "usage is organism [label/labels in file] [position range]"
conn = sqlite3.connect('./sqlite/' + ref + '_ref.db')
labels = []
isfile = False
orange = 3000000
if (len(sys.argv) >= 3):
	if (len(sys.argv) == 4):
		orange = int(sys.argv[3])
	vlabel = sys.argv[2]
	if (os.path.isfile(vlabel) == True):
		lo = open(vlabel, "r")
		for l in lo.readlines():
			labels.append(l.strip()) 
	else:
		labels.append(vlabel)

#fin = open("mart_export_mouse.txt", "r")
c = conn.cursor()
"""
Ensembl Gene ID Gene Start (bp) Gene End (bp)   Chromosome Name Description     EntrezGene ID   RefSeq mRNA [e.g. NM_001195597] UniProt Gene Name
ENSMUSG00000097066      65780905        65867305        13
ENSMUSG00000097793      81778773        81783749        13
ENSMUSG00000097374      57459572        57461553        19
8
"""

lc = 0

c.execute("select count(*) from " + ref + "_ref")
#print ref + " total count " + str(c.fetchone()[0])

c.execute("select distinct(chr) from " + ref + "_ref")
print "var " + ref + "_chrgene_info = [ "
chrs = c.fetchall()
for cc in chrs:
	chr = cc[0]
	#print ref + " chromosome " + chr
	reft = ref + "_ref"
	c.execute("SELECT count(distinct(gene_name)) FROM " + ref + "_ref WHERE chr = '" +  str(chr) + "'")
	print("{'chr_name':'%s','chr_length':%i}," %(chr, c.fetchone()[0]))
	# chr + " unique count " + str(c.fetchone()[0])
print "];\n"
#get count per chr
fine = False
if (len(labels)> 0):
	#c.execute("select * from " + ref + "_ref where ensn = " + label + " or gene_name = " + label  )
	for label in labels:
		c.execute("SELECT chr, start, end, gene_name, ensn FROM " + ref + "_ref WHERE ensn = ? or rfsq = ? or gene_name like ? or entr = ?", (label, label, label, label))
		#print "selecting on " + label
		results = c.fetchall()
		if (results != None and len(results) > 0):			
			rp = 0
			for res in results:
				chr = res[0]
				start = res[1]
				end = str(int(res[2]) + orange)	
				if (rp == 0):
					if (fine == False):
						print "chr:start:end:gene_name:ensemble " + ":".join(res[:2]) + ":"  + end + " :" + res[3] + ":" + res[4]
					else:
						print ":".join(res[:2]) + ":"  + end
				rp = rp + 1 
		else:
			print label + " not found in " + ref
# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()



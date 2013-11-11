import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

#>chr    begin   end     avgNormalizedCvg        relativeCvg     calledLevel     calledCNVType   levelScore      CNVTypeScore



fg = open("genes.fpkm_tracking", "r")
ensgh = {}
for i in fg.readlines():
    # Insert a row of data
    tk = i.strip().split("\t")
    atk = tk[3:7]
    ensgh[tk[3]] = tk[4]

fg.close()

# Create table
c.execute('DROP TABLE IF EXISTS protein')
c.execute('''create table protein
(id text, alias text, abundance float, name text
)''')

f = open("protein_abundance.sorted", "r")

"""filtered_h = {}
for l in ffiltered.readlines():
	filtered_h[l.split("\t")[0]] = 1
ffiltered.close()
#f.close()
filtered_out = open("master.GS00533.SS6002862.tested.illumina.filtered.all", "w")
http://www.proteinatlas.org/ENSG00000184009
"""

for i in f.readlines():
    # Insert a row of data
    sp = ";"
    name = ""
    if (i[0:2] != "uc"):
	sp = "|"
    tk = i.strip().split("\t")
    ktk = tk[0].split(sp)
    pa = []
    pid = ktk[0]
    for t in ktk:
        if (t.find("ENSG") != -1):
	    #first = tk[0].split(";")
	    ensg = t.split("|")[0]
	    pid = ensg
	    if (ensgh.get(pid) != None):
	        name = ensgh[pid]
	    break
    pa.append(pid)
    #link = '<a href="http://genome.ucsc.edu/cgi-bin/hgGene?hgg_gene=%s&org=human" target="_blank">%s</a>' %(tk[1], tk[0])
    alias = ""
    if (len(ktk) > 1):
        alias = " ".join(ktk)
    pa.append(alias)
    pa.append(tk[1])
    pa.append(name)
    c.execute("""insert into protein
                 values (?,?,?,?)""", pa) 

# Save (commit) the changes
conn.commit()
f.close()
# We can also close the cursor if we are done with it
c.close()

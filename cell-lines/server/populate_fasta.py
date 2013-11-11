import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/seq_shsy.db')
c = conn.cursor()
c.execute('DROP TABLE IF EXISTS variant_sequence')
c.execute('''create table variant_sequence
(refseq text, alias text, type text, sequence text
)''')
fsh = {}
fs = open("refseq_gene.dat", "r")
for fi in fs.readlines():
    fk = fi.strip().split(":")
    fsh[fk[0]] = fk[1]
#NR_030281:ENSG00000208011 MIR92B
fs.close()

f = open("/mnt/cellines_bio3/cdna_with_all_variants.fasta", "r")
activeid = ""
seq = ""
ct = 0
noref = []
for i in f.readlines():
    # Insert a row of data
    i = i.strip()
    if (i.find(">NM") != -1  and seq == ""):
	i = i.replace(">", "")
        activeid = i.strip().split(".")[0]
    elif (i.find(">NM") == -1):
        seq = seq + i
    elif (i.find(">NM") != -1 and activeid != ""):
	ct = ct + 1
        tk = []
	tk.append(activeid)
	alias = ""
	if (fsh.get(activeid) != None):
	    alias = fsh[activeid]
	else:
	    noref.append(activeid)
	tk.append(activeid + " " + alias)
	tk.append("heterozygous")
	tk.append(seq)
	c.execute("""insert into variant_sequence
		                 values (?,?,?,?)""", tk) 
	seq = ""
	previd = activeid
	i = i.replace(">", "")
	activeid = i.strip().split(".")[0]
	if (ct % 999 == 0):
	    print "mod999 inserted gene %s new  %s"  %(previd, activeid)
	    #c.execute("select * from heterozygous where alias like '%"+previd+"%'")
	    #print c.fetchone()
print len(noref)
#print noref
#cdna_with_hom_variants.fasta
fho = open("/mnt/cellines_bio3/cdna_with_hom_variants.fasta", "r")
activeid = ""
seq = ""
ct = 0
noref = []
for i in fho.readlines():
    # Insert a row of data
    i = i.strip()
    if (i.find(">NM") != -1  and seq == ""):
        i = i.replace(">", "")
        activeid = i.strip().split(".")[0]
    elif (i.find(">NM") == -1):
        seq = seq + i
    elif (i.find(">NM") != -1 and activeid != ""):
        ct = ct + 1
        tk = []
        tk.append(activeid)
        alias = ""
        if (fsh.get(activeid) != None):
            alias = fsh[activeid]
        else:
            noref.append(activeid)
        tk.append(activeid + " " + alias)
        tk.append("homozygous")
        tk.append(seq)
        c.execute("""insert into variant_sequence
                                 values (?,?,?,?)""", tk)
        seq = ""
        previd = activeid
        i = i.replace(">", "")
        activeid = i.strip().split(".")[0]
        if (ct % 999 == 0):
            print "mod999 inserted gene %s new  %s"  %(previd, activeid)
            #c.execute("select * from heterozygous where alias like '%"+previd+"%'")
            #print c.fetchone()

print len(noref)
print noref

# Save (commit) the changes
conn.commit()
f.close()
fho.close()
# We can also close the cursor if we are done with it
c.close()

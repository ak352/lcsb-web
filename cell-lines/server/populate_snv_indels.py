import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

# Create table
#c.execute('DROP TABLE IF EXISTS snv_indel_shsy')
#c.execute('''create table snv_indel_shsy
#(variant_id integer, chromosome text, begin integer, end integer, var_type text, reference text, allele_seq text, xref text, complete_genomics text, illumina text, passed text )''')

f = open("master.GS00533.SS6002862.tested.illumina", "r")
ffiltered = open("master.GS00533.SS6002862.tested.illumina.filtered", "r")

filtered_h = {}
for l in ffiltered.readlines():
	filtered_h[l.split("\t")[0]] = 1
ffiltered.close()
#f.close()
filtered_out = open("master.GS00533.SS6002862.tested.illumina.filtered.all", "w")
for i in f.readlines():
    # Insert a row of data
    tk = i.strip().split("\t")
    id = tk[0]
    passed = 'N'
    if (filtered_h.get(id) != None):
        passed = 'Y'
    tk.append(passed)
    #c.execute("""insert into snv_indel_shsy
    #             values (?,?,?,?,?,?,?,?,?,?,?)""", tk) 
    filtered_out.write("\t".join(tk) + "\n")
# *i.split(", ") does unpack the list as arguments

filtered_out.close()
# Save (commit) the changes
conn.commit()
f.close()
# We can also close the cursor if we are done with it
c.close()

import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

#>chr    begin   end     avgNormalizedCvg        relativeCvg     calledLevel     calledCNVType   levelScore      CNVTypeScore


# Create table
c.execute('DROP TABLE IF EXISTS rnaseq')
c.execute('''create table rnaseq
(id text, name text, tss text, locus text, fpkm double, fpkm_conf_lo double, fpkm_conf_high double 
)''')

f = open("genes.fpkm_tracking", "r")

for i in f.readlines():
    # Insert a row of data
    
    tk = i.strip().split("\t")
    atk = tk[3:7]

    atk.append(tk[9])
    atk.append(tk[10])
    atk.append(tk[11])
    c.execute("""insert into rnaseq
                 values (?,?,?,?,?,?,?)""", atk) 

# Save (commit) the changes
conn.commit()


f.close()
# We can also close the cursor if we are done with it
c.close()

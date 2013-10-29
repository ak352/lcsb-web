import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

# Create table
c.execute('DROP TABLE IF EXISTS metabolomic')
c.execute('''create table metabolomic
(name text, kegg_id integer, abundance float, std double, kegg_linkend text
)''')

f = open("Metabolomics.tsv", "r")
#ffiltered = open("master.GS00533.SS6002862.tested.illumina.filtered", "r")

"""filtered_h = {}
for l in ffiltered.readlines():
	filtered_h[l.split("\t")[0]] = 1
ffiltered.close()
#f.close()
filtered_out = open("master.GS00533.SS6002862.tested.illumina.filtered.all", "w")
"""

for i in f.readlines():
    # Insert a row of data
    tk = i.strip().split("\t")
    link = '<a href="http://www.genome.jp/dbget-bin/www_bget?cpd:%s" target="_blank">%s</a>' %(tk[1], tk[0])

    """id = tk[0]
    passed = 'N'
    if (filtered_h.get(id) != None):
        passed = 'Y'
    """

    tk.append(link)
    c.execute("""insert into metabolomic
                 values (?,?,?,?,?)""", tk) 

# Save (commit) the changes
conn.commit()


f.close()
# We can also close the cursor if we are done with it
c.close()

import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()


# Create table
print "dropping table %s " %(time.asctime( time.localtime(time.time()) ))

c.execute('DROP TABLE IF EXISTS snv_indel_shsy')
c.execute('''create table snv_indel_shsy
(variant_id integer, chromosome text, begin integer, end integer, var_type text, reference text, allele_seq text, xref text, complete_genomics text, illumina text, passed text, name text )''')

fr = open("human_chrgene_loci.dat", "r")
gh = {}
print "load gene hash %s " %(time.asctime( time.localtime(time.time()) ))
#human_chrgene_loci.dat
#chr1:MIR92B 155164968 155165063
for l in fr.readlines():
  tk = l.strip().split(":")
  if (gh.get(tk[0]) == None):
    gh[tk[0]] = {}
  else:
    gh[tk[0]][tk[1]] = tk[1].split(" ")[1:]    
  #gh[tk[0]] = tk[1].split(" ")
fr.close()
#MIR92B:chr1 155164968 155165063

print "read snps %s " %(time.asctime( time.localtime(time.time()) ))
pp = 0
f = open("master.GS00533.SS6002862.tested.illumina.filtered.all", "r")
for i in f.readlines():
    # Insert a row of data
    pp = pp + 1
    tk = i.strip().split("\t")
    chr = tk[1]
    gene = ""
    for gn in gh[chr]:
	loci = gh[chr][gn]
	#print loci	
	start = int(tk[2])
	end = int(tk[3])
	gstart = int(loci[0])
	gend = int(loci[1])
	if (start >= gstart and end <= gend):
	    gene = gn.split(" ")[0]
            tk.append(gene)
	    #print tk	
            c.execute("""insert into snv_indel_shsy
                 values (?,?,?,?,?,?,?,?,?,?,?,?)""", tk)
            if (pp%9999 == 0):
                print str(pp) + " " + gene + " processed 10k record " + time.asctime( time.localtime(time.time()) )
            break
    #filtered_out.write("\t".join(tk) + "\n")

# *i.split(", ") does unpack the list as arguments

#filtered_out.close()
# Save (commit) the changes
print "commit %s" %(time.asctime( time.localtime(time.time()) ))
conn.commit()

select = "select * from snv_indel_shsy where name = 'CDK11B'"
c.execute(select)
print c.fetchone()
f.close()
# We can also close the cursor if we are done with it
c.close()
conn.close()

import sys
import sqlite3
import time

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

#>chr    begin   end     avgNormalizedCvg        relativeCvg     calledLevel     calledCNVType   levelScore      CNVTypeScore


# Create table
c.execute('DROP TABLE IF EXISTS cnv_segments')
c.execute('''create table cnv_segments
(chr text, begin integer, end integer, avg_normalized_cvg double, relative_cvg double, called_level text, level_score float, name text
)''')

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
#stub out chrM
gh["chrM"] = {}

f = open("cnvSegmentsNondiploidBeta-GS00533-DNA_A01_201_37-ASM.tsv", "r")
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
    atk = tk[0:6]
    atk.append(tk[-2])
    gene = ""
    chr = tk[0]
    for gn in gh[chr]:
        loci = gh[chr][gn]
        #print loci     
        start = int(tk[1])
        end = int(tk[2])
        gstart = int(loci[0])
        gend = int(loci[1])
        if (start <= gstart and end >= gend):
	    #<a href="http://www.w3schools.com/" target="_blank">Visit W3Schools!</a> http://www.genecards.org/cgi-bin/carddisp.pl?gene=ADAM3A
	    gene = '<a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene=%s" target="_blank">%s</a>' %(gn.split(" ")[0],gn.split(" ")[0]) + " " + gene
    atk.append(gene)
    c.execute("""insert into cnv_segments
                 values (?,?,?,?,?,?,?,?)""", atk)
	#break
	
#if (gene == ""):
 #       atk.append(gene)
  #      c.execute("""insert into cnv_segments
   #     values (?,?,?,?,?,?,?,?)""", atk)

# Save (commit) the changes
conn.commit()

f.close()
# We can also close the cursor if we are done with it
c.close()

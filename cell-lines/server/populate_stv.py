import sys
import sqlite3
import time

def is_int(a):
    """Returns true if a can be an interger"""
    try:
        int (a)
        return True
    except:
        return False

# Open database (will be created if not exists)
conn = sqlite3.connect('./sqlite/snv_indel_shsy.db')
c = conn.cursor()

#>chr    begin   end     avgNormalizedCvg        relativeCvg     calledLevel     calledCNVType   levelScore      CNVTypeScore


# Create table

c.execute('DROP TABLE IF EXISTS structural_variation')
c.execute('''create table structural_variation
(chr1 text, position1 integer, length1 integer, chr2 text, position2 integer, length2 integer, frequency double, assembled_sequence text, stv_type text, name1 text, name2 text 
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
#stub out chrM
gh["chrM"] = {}

pomo = open("shsy5y_pomo_freq.tsv", "w")

f = open("allJunctionsBeta-GS00533-DNA_A01_201_37-ASM.tsv")#highConfidenceJunctionsBeta-GS00533-DNA_A01_201_37-ASM.tsv", "r")
ct = 0
for i in f.readlines():
    # Insert a row of data
    
    tk = i.strip().split("\t")
    if (len(tk)<26 or is_int(tk[0]) == False):
	continue
    """link = '<a href="http://www.genome.jp/dbget-bin/www_bget?cpd:%s" target="_blank">%s</a>' %(tk[1], tk[0])
    id = tk[0]
    passed = 'N'
    if (filtered_h.get(id) != None):
        passed = 'Y'
    tk.append(link)
    """
    chr1 = tk[1]
    chr2 = tk[5]
    atk = tk[1:3]
    atk.append(tk[4])
    atk.append(tk[5])
    atk.append(tk[6])
    atk.append(tk[8])
    atk.append(tk[23])
    atk.append(tk[24])
    atk.append(tk[26])
    gene1 = ""
    gene2 = ""
    gene1n = ""
    gene2n = ""
    wide = False
    for gn in gh[chr1]:
        loci = gh[chr1][gn]
        start = int(tk[2])
        gstart = int(loci[0])
	gend = int(loci[1])
        if (start-5000  <= gstart and start + 5000 >= gend):
            #<a href="http://www.w3schools.com/" target="_blank">Visit W3Schools!</a> http://www.genecards.org/cgi-bin/carddisp.pl?gene=ADAM3A
            gene1 = '<a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene=%s" target="_blank">%s</a>' %(gn.split(" ")[0],gn.split(" ")[0]) + " " + gene1 
	    gene1n = "GEXP:" + gn.split(" ")[0]
	    #break
	elif (start-25000  <= gstart and start + 25000 >= gend):
	    wide = True
    for gn in gh[chr2]:
        loci = gh[chr2][gn]
        start = int(tk[6])
        gstart = int(loci[0])
	gend = int(loci[1])
        if (start-5000  <= gstart and start + 5000 >= gend):
            #<a href="http://www.w3schools.com/" target="_blank">Visit W3Schools!</a> http://www.genecards.org/cgi-bin/carddisp.pl?gene=ADAM3A
            gene2 = '<a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene=%s" target="_blank">%s</a>' %(gn.split(" ")[0],gn.split(" ")[0]) + " " + gene2
	    gene2n = "GEXP:" + gn.split(" ")[0]
	    #break
	elif (start-10000  <= gstart and start + 10000 >= gend):
	    wide = True
    atk.append(gene1)
    atk.append(gene2)
    color = ""
    freq = float(tk[23])
    if (chr1 != chr2):
        ct +=1
        if (gene1 != "" and gene2 != ""):
	    color = "red"
        elif (gene1 != "" or gene2 != ""):
            color = "darkblue"
        if (color == "" and wide == True):
	    color = "gray"
	if (freq <= .25 and color != ""):
	    mstr = "%s\t%s\t%s\n" %(":".join(tk[1:3]) + ":" + str(int(tk[2]) + int(tk[4])) + ":" + gene1n, (":".join(tk[5:7])) +  ":" + str(int(tk[6]) + int(tk[8])) + ":" + gene2n, color )
	    pomo.write(mstr.replace("chr", ""))
            #pomo.write("%s\t%s\t%s\n" %(":".join(tk[1:3]) + ":" + str(int(tk[2]) + int(tk[4])) + ":" + gene1n, (":".join(tk[5:7])) +  ":" + str(int(tk[6]) + int(tk[8])) + ":" + gene2n, color )) 
    c.execute("""insert into structural_variation
                 values (?,?,?,?,?,?,?,?,?,?,?)""", atk) 
pomo.close()
# Save (commit) the changes
#print ct
conn.commit()
f.close()
# We can also close the cursor if we are done with it
c.close()

inf = open("master.GS00533.SS6002862.tested.illumina", "r")
hh = {}

dbsnphh = {}
"""
variantId       chromosome      begin   end     varType reference       alleleSeq       xRef    
GS00533-DNA_A01_201_37-ASM      SS6002862
"""
known = 0
novel = 0
for l in inf.readlines():
	tk = l.strip().split("\t")
	xref = tk[7]
	if (xref == ""):
		novel = novel + 1
	elif (xref.find("dbsnp") != -1):
		known = known + 1
	elif (hh.get(tk[7]) == None):
		hh[tk[7]] = 1
print len(hh)
print hh
print "dbsnp_ref " + str(known)
print "no xref " + str(novel)
inf.close()

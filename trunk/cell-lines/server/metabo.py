mf = open("Metabolomics.tsv", "r")
inkeggs = ""
ka = {}
for l in mf.readlines():
	tk = l.strip().split("\t")
	inkeggs = inkeggs + "'" + tk[1] + "',"
	link = '<a href="http://www.genome.jp/dbget-bin/www_bget?cpd:%s" target="_blank">%s</a>' %(tk[1], tk[0]) 
	print "<tr><td>&nbsp;" + link + "</td></td>&nbsp;" + tk[2] + "</td></td>&nbsp;" + tk[3] + "</td></tr>" 
	if (ka.get(tk[1]) == None):
		ka[tk[1]] = 1
	#else:
		#print "dupe " + tk[1]
print len(ka)
mf.close()
print inkeggs
print len(inkeggs.split(","))

inf = open("highConfidenceJunctionsBeta-GS00533-DNA_A01_201_37-ASM.tsv", "r")
#Id     LeftChr LeftPosition    LeftStrand      LeftLength      RightChr        RightPosition
lc = 0
for l in inf.readlines():
	tk = l.strip().split("\t")
	if (lc == 1629):
		print len(tk)
	if (len(tk) > 10):
		intrachr = tk[10]
		if (intrachr != 'N'):
			print tk[1] + ":" + tk[2] + "\t" + tk[5] + ":" + tk[6]
		#if (tk[18] + tk[19] != ""):
		#	print tk[18] + " " + tk[19] 
		if (len(tk) > 27):
                        print " event type " + tk[26] + "\t" + str(tk[0]) + "\t" + tk[27]

	lc = lc + 1
inf.close()

function initSNP(){
	alert("retrieve data from snv_indel db");
}
function initCNV(){
	var rawdata = "<a href='data/raw/CNV.tsv'>raw CNV data</a><br>";
        var klinks = "<a href='images/cn_annotations.png'><img src='images/cn_annotations.png' alt='pomo rings' height='400' width='400'></a><br>";
	$("#CNV").html(rawdata + klinks + "<br>show all 360 segments tabular");
}

function initSTV(){
	var rawdata = "<a href='data/raw/STV.tsv'>raw SV data</a><br>";        
        var klinks = "<a href='images/cn_annotations.png'><img src='images/cn_annotations.png' alt='pomo rings' height='400' width='400'></a><br>";
	$("#STV").html(rawdata + klinks + "<br>Search on Frequency: slider on 0 .. 1");
}

function initMetabolomics(){
	var rawdata = "<a href='data/raw/Metabolomics.tsv'>raw data</a><br>";
	var klinks = "";
	for (var i = 0; i < 60; i++){
		klinks = klinks + "name <a href='http://www.genome.jp/dbget-bin/www_bget?cpd:C01620'>kegg_" + i + "</a>&nbsp abundence<br>";
	}
	$("#Metabolite").html(rawdata + klinks);
}



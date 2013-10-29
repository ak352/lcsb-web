function initSNP(){
	var rawdata = "<a href='data/raw/SNP.tsv'>raw SNP data</a><br>";
        $("#SNP").append(rawdata + "<br>Filter on SNPs and Indels");

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

function initRNASeq(){
        var rawdata = "<a href='data/raw/RNASeq.tsv'>raw RNASeq data</a><br>";
        $("#RNASeq").append(rawdata + "<br>Build Network with RNASeq + Metabolomics + Proteomics");
}

function initMicroarray(){
        var rawdata = "<a href='data/raw/microarray_gse9169.tsv'>raw Microarray_GSE9169 data</a>&nbsp;<a href='data/raw/microarray_shsy5y.tsv'>SH-SY5Y</a><br>";
        $("#Microarray").append(rawdata + "<br>Links to GEO for related GSE/GSM <a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM1195213'>http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM1195213</a>");
}

function initProtein(){
        var rawdata = "<a href='data/raw/Protein.tsv'>raw Protein abundance data</a><br>";
        $("#Protein").append(rawdata + "<br>Build Network with RNASeq + Metabolomics + Proteomics");

}

function initMetabolomics(){
	var rawdata = "<a href='data/raw/Metabolomics.tsv'>download raw data</a><br>";
	/*var klinks = "<table><tr><th>Metabolite</th><th>KeggId</th><th>Abundance</th><th>relSTD</th><th>KeggDetails</th></tr>";
	for (var i = 0; i < 60; i++){
		klinks = klinks + "name <a href='http://www.genome.jp/dbget-bin/www_bget?cpd:C01620'>kegg_" + i + "</a>&nbsp abundence<br>";
	}
	$("#Metabolite").html(rawdata + klinks + "</table>");
	*/$('#Metabolite').html( rawdata + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="mettable"></table>' );
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_metabolomic.cgi",
                        data: {'experiment_id': 'x'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){new Messi('Error on get_experiment_details.cgi call, please inform Daniel/Jake with work sequence. Refresh page', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _metdata = jo["aaData"];
                                $('#mettable').dataTable( {
				        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
					"aaData": _metdata,
					"aoColumns": [
					{ "sTitle": "Name" },{ "sTitle": "KEGG ID" },
					{ "sTitle": "Abundance" },
					{ "sTitle": "relative STD", "sClass": "center" },
					{ "sTitle": "Detail Link" }]
    					}); 
                        },
                        error: function(){
                                alert("Error retrieving experiment group details");
                        }
                });
}
/*
	$('#mettable').dataTable( {
        "aaData": [
            [ "Trident", "Internet Explorer 4.0", "Win 95+", 4, "X" ],
            [ "Trident", "Internet Explorer 5.0", "Win 95+", 5, "C" ],
            [ "Trident", "Internet Explorer 5.5", "Win 95+", 5.5, "A" ],
            [ "Trident", "Internet Explorer 6.0", "Win 98+", 6, "A" ],
            [ "Trident", "Internet Explorer 7.0", "Win XP SP2+", 7, "A" ],
            [ "Gecko", "Firefox 1.5", "Win 98+ / OSX.2+", 1.8, "A" ],
            [ "Gecko", "Firefox 2", "Win 98+ / OSX.2+", 1.8, "A" ],
            [ "Gecko", "Firefox 3", "Win 2k+ / OSX.3+", 1.9, "A" ],
            [ "Webkit", "Safari 1.2", "OSX.3", 125.5, "A" ],
            [ "Webkit", "Safari 1.3", "OSX.3", 312.8, "A" ],
            [ "Webkit", "Safari 2.0", "OSX.4+", 419.3, "A" ],
            [ "Webkit", "Safari 3.0", "OSX.4+", 522.1, "A" ]
        ],
        "aoColumns": [
            { "sTitle": "Engine" },
            { "sTitle": "Browser" },
            { "sTitle": "Platform" },
            { "sTitle": "Version", "sClass": "center" },
            { "sTitle": "Grade", "sClass": "center" }
        ]
    } );   
}
*/


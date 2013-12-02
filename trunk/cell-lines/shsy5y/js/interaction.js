/*$.fn.dataTableExt.ofnSearch['freq-num'] = function ( sData ) {
  var fval = $("#freqrange").val();
  if (parseFloat(sData) >= parseFloat(fval)){
    return sData;//.replace(/\n/g," ").replace( /<.*?>/g, "" );
  }
}
*/

function searchSnp(){
    $( "#snp_dialog" ).html("<img src='images/progress.gif' />");
      var parameter = escape($("#search_input").val());
	var column = $("#columns").val();
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_snp.cgi",
                        data: {'parameter': parameter,'column': column},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
					new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
				$("#snp_dialog").html(_data.length + " rows returned");
                                $('#snptable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "aaData": _data,
					"oLanguage": { "sSearch": "Filter Results" }, 
                                        "aoColumns": [
                                        { "sTitle": "Chromosome" },{ "sTitle": "Begin" },{ "sTitle": "End" },{ "sTitle": "Name" },
                                        { "sTitle": "Var_Type" },{ "sTitle": "Reference" }, { "sTitle": "Allele_Seq" },{ "sTitle": "<SPAN TITLE='Allele calls from CompleteGenomics platform 00 means both alleles equal reference, where 11 means a homozygous call, 01/10 are heterozygous. N implies insufficient coverage, with possible NN/0N/1N/N0/N1.'>Complete_Genomics</SPAN>"},{ "sTitle": "<SPAN TITLE='Allele calls from Illumina platform 00 means both alleles equal reference, where 11 means a homozygous call, 01/10 are heterozygous. N implies insufficient coverage, with possible NN/0N/1N/N0/N1.'>Illumina</SPAN>" },{ "sTitle": "XRef links" }]
                                        });
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

function snp_selection(){
    var column = $('#columns').val();
    var autocomplete = $('#search_input').typeahead();
    if (column == "name"){
	autocomplete.data('typeahead').source = hg19genes;
    }else{
	autocomplete.data('typeahead').source = []; 
    }
}

function initSNP(){
      var rawdata = "<a href='data/raw/SNP.gz'>download SNP data (gzip)</a><br>";
        // chromosome, begin, end, var_type, reference, allele_seq, complete_genomics, illumina, xref $("#SNP").append(rawdata + "<br>Filter on SNPs and Indels");
	var searchin = '&nbsp;<input type="search" style="display:block;width:250px;" size="200" name="search_input" id="search_input" data-provide="typeahead" data-items="10" TITLE="By default, Search does partial match on selected snp columns except for name, where it will match on exact gene name. The advanced column function allows for custom selects, essentially the field becomes a free where clause meaning that syntax must be correct, each of the column header below exactly match a column in the db, such as xref = xref. Multiple columns and using AND OR clause are ok. Text(String) fields require single quotes and LIKE requires %"  placeholder="Enter value">';
        var columns = 'Column: <select id = "columns" name="columns" onchange="snp_selection()" style="display:inline"><option value="name">Gene name</option><option value="chromosome">Chr</option><option value="begin">Begin</option><option value="end">End</option><option value="var_type">VarType</option><option value="reference">Reference</option><option value="allele_seq">AlleleSeq</option><option value="complete_genomics">CompleteGenomics</option><option value="illumina">Illumina</option><option value="xref">XRef</option><option value = "advanced">Advanced</option></select>';
	var button = '&nbsp;<button id="searchSnp" value="Filter" onClick="searchSnp()">Search</button>&nbsp;<span id="snp_dialog"></span>'; 
	$('#SNP').html( rawdata + '<br>' + columns + searchin + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="snptable"></table>' );
        $( "#snp_dialog" ).html("<img src='images/progress.gif' />");
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_snp.cgi",
                        data: {'exp': 'na'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
					new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
				$("#search_input").css("display","inline");    
				$("#snp_dialog").html(_data.length + " rows returned");
				$('#search_input').typeahead({source: hg19genes}); 
                                $('#snptable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
					"oLanguage": { "sSearch": "Filter Results" },    
                                        "aaData": _data,
                                        "aoColumns": [
                                        { "sTitle": "Chromosome" },{ "sTitle": "Begin" },{ "sTitle": "End" },{ "sTitle": "Name" },
                                        { "sTitle": "VarType" },{ "sTitle": "Reference" }, { "sTitle": "Allele_Seq" },{ "sTitle": "<SPAN TITLE='Allele calls from CompleteGenomics platform 00 means both alleles equal reference, where 11 means a homozygous call, 01/10 are heterozygous. N implies insufficient coverage, with possible NN/0N/1N/N0/N1.'>Complete_Genomics</SPAN>"},{ "sTitle": "<SPAN TITLE='Allele calls from Illumina platform 00 means both alleles equal reference, where 11 means a homozygous call, 01/10 are heterozygous. N implies insufficient coverage, with possible NN/0N/1N/N0/N1.'>Illumina</SPAN>" },{ "sTitle": "XRef links" }]
                                        });
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

function initCNV(){
	var rawdata = "<a href='data/raw/CNV.tsv'>Download raw CNV data</a><br>";
        var klinks = "<a href='images/figure2.png'><img src='images/figure2.png' alt='pomo rings' height='400' width='600'></a><br>Red indicates Copy Number Ratio gained > 1.5, Blue implies lost. Gray? Half ticks equal .5 ratio";
	$("#CNV").html(rawdata + klinks + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="cnvtable"></table><br><br>');
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_cnv_segment.cgi",
                        data: {'experiment_id': 'x'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _cnvdata = jo["aaData"];
                                var cTable = $('#cnvtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 50,
                                        "aaData": _cnvdata,
                                        "aoColumns": [
                                        { "sTitle": "Chromosome" },
					{ "sTitle": "Begin" },
                                        { "sTitle": "End" },{ "sTitle": "Genes in region" },
                                        { "sTitle": "Avg Normalized Coverage", "sClass": "center" },
					{ "sTitle": "Relative Coverage", "sClass": "center" },
                                        { "sTitle": "Called Level" },{ "sTitle": "Level Score" } ]
                                        });
				   cTable.fnSort( [ [4,'asc'], [0,'asc'], [1,'asc'] ] ); 
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

/*document.getElementById("freqrange").onchange=function(e){
    console.log("Value = "+this.value);
};

function freqchange(){
    var fval = $("#freqrange").val();
    stvTable.fnFilter(fval, 7);
}
*/

var stvTable;
function initSTV(){
	var rawdata = "<a href='data/raw/STV.tsv'>Download SV data</a><br><a href='https://yanex.googlecode.com/files/pomo_userguide.pdf'><SPAN TITLE='Link contains user guide to POMO interactive circular omics plots'>POMO visualizations</SPAN></a>";//Frequency:<input type='range' id='freqrange' name='freqrabge' min='0' max='1' step='.01' value='.5' onchange='freqchange();'>";
        var klinks = "<a href='http://pomo.cs.tut.fi/?fileurl=http://systemsbiology.uni.lu/shsy5y/data/shsy5y_pomo.tsv&organism=human' target='_blank'><img src='images/shsy_pomo_compressed.png' alt='pomo rings' height='400' width='400'></a><br>";
	var klinks2 = "<a href='http://pomo.cs.tut.fi/?fileurl=http://systemsbiology.uni.lu/shsy5y/data/shsy5y_pomo_freq.tsv&organism=human' target='_blank'><img src='images/shsy_pomo_conf_compressed.png' alt='pomo rings' height='400' width='400'></a><br>";

	$( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 1,
      step:.01,
      values: [ .1, .9 ],
      stop: function( event, ui ) {
        $( "#freqspan" ).html("Update Frequency Range:" + ui.values[ 0 ] + "-" + ui.values[ 1 ] );
	    var parameter = ui.values[0] + ":" + ui.values[1];
	    $( "#stvdialog" ).html("<img src='images/progress.gif' />");
	    $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_stv.cgi",
                        data: {'parameter': parameter},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
					new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _stvdata = jo["aaData"];
				$( "#stvdialog" ).html(_stvdata.length + " results found");
                                stvTable = $('#stvtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "aaData": _stvdata,
                                        "aoColumns": [
                                        { "sTitle": "Chr" },
                                        { "sTitle": "Position:Length" },
                                        { "sTitle": "LeftGene" },
                                        { "sTitle": "Chr" },
                                        { "sTitle": "Position:Length" },
                                        { "sTitle": "RightGene" },
                                        { "sTitle": "Type" },
                                        { "sTitle": "<span TITLE='Frequency in Baseline parameter is calculated as (number of baseline genomes containing corresponding junctions) / (total number of baseline genomes).'>Frequency</span>" },
                                        { "sTitle": "AssembledSequence" }
                                        ]
                                });
                                stvTable.fnSort( [ [7,'desc']] );
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
	 }
    });
    $( "#slider-range .ui-slider-range" ).css('background', 'rgb(0,255,0)');
    $( "#stvdialog" ).html("<img src='images/progress.gif' />");
	$('#STV').append( '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="stvtable"></table>');         	
	$( "#pomoc").html(rawdata + "<br><table style='width:80%'><tr><td>" + klinks + "</td><td>" + klinks2 + "</td></tr><td>Red:Dual Gene Regions Blue:Single Gene Region Gray:Gene Region within +-10000 bases               </td><td>Red:Dual Gene Regions Blue:Single Gene Region Gray:Gene Region within +-20000 bases, with .20 Freq cutoff</td></tr></table><br>");
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_stv.cgi",
                        data: {'experiment_id': 'x'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){new Messi('Error on retrieving structural variations', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _stvdata = jo["aaData"];
				$( "#stvdialog" ).html(_stvdata.length + " results found");
                                stvTable = $('#stvtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "aaData": _stvdata,
                                        "aoColumns": [
                                        { "sTitle": "Chr" },
					{ "sTitle": "Position:Length" },
                                        { "sTitle": "Gene" },
					{ "sTitle": "Chr" },
                                        { "sTitle": "Position:Length" },
                                        { "sTitle": "Gene" },
					{ "sTitle": "Type" },
					{ "sTitle": "<span TITLE='Frequency in Baseline parameter is calculated as (number of baseline genomes containing corresponding junctions) / (total number of baseline genomes).'>Frequency</span>" },					
                                        { "sTitle": "AssembledSequence" }
                                        ]
				});
                        },
                        error: function(){
                                alert("Error retrieving experiment group details");
                        }
                });
}

function resetSTV(){
      $("#stvtable").html("");
}


function searchRNASeq(){
    $( "#rna_dialog" ).html("<img src='images/progress.gif' />");
      var parameter = escape($("#rnasearch_input").val());
        var column = $("#rnacolumns").val();
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_rnaseq.cgi",
                        data: {'parameter': parameter,'column': column},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                $("#rna_dialog").html(_data.length + " rows returned");
                        	rnatable = $('#rnaseqtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "oLanguage": { "sSearch": "Filter Results" },
                                        "aaData": _data,
                                        "aoColumns": [
                                        { "sTitle": "Id" },{ "sTitle": "Name" },
                                        { "sTitle": "Locus" },{ "sTitle": "<SPAN TITLE='Cufflinks measures transcript abundances in Fragments Per Kilobase of exon per Million fragments mapped'>FPKM</SPAN>" }, { "sTitle": "FPKM_Lo" },{ "sTitle": "FPKM_Hi" },{ "sTitle": "TSS" }]
                                        });
				rnatable.fnSort( [ [3,'desc']] );
			},
                        error: function(){
                        	new Messi('Error on data retrieval, please contact help', {title: 'Server error'});
			}
                });
}
function rna_selection(){
    var column = $('#rnacolumns').val();
    var autocomplete = $('#rnasearch_input').typeahead();
    if (column == "name"){
        autocomplete.data('typeahead').source = hg19genes;
    }else{
        autocomplete.data('typeahead').source = [];
    }
}

var rnatable;
function initRNASeq(){
        var rawdata = "<a href='data/raw/RNASeq.gz'>download RNASeq data (gzip)</a><br>";
	var searchin = '&nbsp;<input type="search" style="display:block;width:250px;" size="200" name="rnasearch_input" id="rnasearch_input" data-provide="typeahead" data-items="10" TITLE="By default, Search does partial match on selected columns. The advanced column function allows for custom selects, essentially the field becomes a free where clause meaning that syntax must be correct, each of the column header below match a column in the db, such as FPKM = FPKM. Multiple columns and using AND OR clause are ok. Text(String) fields require single \' quotes and LIKE requires % numeric fields can take >, < values without quotes"  placeholder="Enter value">';
	var columns = 'Column: <select id = "rnacolumns" name="rnacolumns" onchange="rna_selection()" style="display:inline"><option value="name">Name</option><option value="id">Id</option><option value="locus">Locus</option><option value="fpkm">FPKM</option><option value="fpkm_conf_lo">FPKM_Conf_Lo</option><option value="fpkm_conf_high">FPKM_Conf_Hi</option><option value="tss">TSS</option><option value = "advanced">Advanced</option> </select>';
        var button = '&nbsp;<button id="searchRNA" value="Filter" onClick="searchRNASeq()">Search</button>&nbsp;<span id="rna_dialog"></span>';
        $('#RNASeq').html( rawdata + '<br>' + columns + searchin + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="rnaseqtable"> <thead><tr><th width="10%">Id</th><th width="10%">Name</th><th width="10%">Locus</th><th width="10%">FPKM</th><th width="10%">FPKM_Lo</th><th width="10%">FPKM_Hi</th><th width="40%">TSS</th></tr><tbody></tbody></table>' );

	$( "#rna_dialog" ).html("<img src='images/progress.gif' />");
	  $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_rnaseq.cgi",
                        data: {'exp': 'na'},
                        success: function(json)
                        {
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                $("#rnasearch_input").css("display","inline");
				$('#rnasearch_input').typeahead({source: hg19genes});
	    			$("#rna_dialog").html(_data.length + " rows returned");
                                rnatable = $('#rnaseqtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "oLanguage": { "sSearch": "Filter Results" },
                                        "aaData": _data					/*,
					"bAutoWidth": false,
                                        "aoColumns": [
                                        { "sTitle": "Id","sWidth": "10%"},
					{ "sTitle": "Name","sWidth": "10%" },
                                        { "sTitle": "Locus","sWidth": "10%" },
					{ "sTitle": "<SPAN TITLE='Cufflinks measures transcript abundances in Fragments Per Kilobase of exon per Million fragments mapped'>FPKM</SPAN>","sWidth": "10%"}, 
					{ "sTitle": "FPKM_Conf_Lo","sWidth": "10%" },
					{ "sTitle": "FPKM_Conf_Hi","sWidth": "10%" },
					{ "sTitle": "TSS","sWidth": "40%"}]*/
                                        });
                        },
                        error: function(){
                        	new Messi('Error on data retrieval, please contact help', {title: 'Server error'});
			}
                });
}

function resetMicroarray(){
    $("#Microarray").html("");
}

var geotable;

function searchMicroarray(){
    var genein = $('#geosearch_input').val();
    var column = $('#geocolumn').val();
    if (genein.length < 3){
        new Messi('Please enter a valid gene name or string longer than 4 characters...', {title: 'Validation error'});
        return;
    }
    $( "#geo_dialog" ).html("<img src='images/progress.gif' />");
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_microarray.cgi",
                        data: {'parameter': genein.toUpperCase(), 'function':column},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
				var _data = jo["aaData"];
                                $("#geo_dialog").html(_data.length + " rows returned");
                                geotable = $('#geotable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "oLanguage": { "sSearch": "Filter Results" },
                                        "aaData": _data,
                                        "aoColumns": [
					{ "sTitle": "Name" },{ "sTitle": "Annotation" },{ "sTitle": "GEO Samples" }]
                                        });                        
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

function initMicroarray(){
    var rawdata = "<a href='data/raw/microarray_gse9169.gz'>download Microarray_GSE9169 </a>&nbsp;<a href='data/raw/microarray_shsy5y.gz'>SH-SY5Y (gzip)</a><br>";
    var searchin = '&nbsp;<input type="search" style="display:block;width:250px;" size="200" name="geosearch_input" id="geosearch_input" data-provide="typeahead" data-items="10" TITLE="By default, Search does partial match on selected columns. Using advanced, multiple columns and using AND OR clause are ok. Text(String) fields require single \' quotes and LIKE requires % numeric fields can take >, < values without quotes"  placeholder="Enter value">';
        var columns = 'Column: <select id = "geocolumn" style="display:inline"><option value="name">Name</option><option value="anno">Annotation</option><option value="alias">Alias</option><option value = "advanced">Advanced</option></select>';
        var button = '&nbsp;<button id="searchGeo" value="Filter" onClick="searchMicroarray()">Search</button>&nbsp;<span id="geo_dialog"></span>';
        $('#Microarray').html( rawdata + '<br>Find other expressed genes collected from published GEO Experiments related to SH-SY5Y. Experiment names are detailed links.<br>' + columns + searchin + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="geotable"></table>' );
        $( "#geo_dialog" ).html("<img src='images/progress.gif' />");
          $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_microarray.cgi",
                        data: {'exp': 'na'},
                        success: function(json)
                        {
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                $("#geosearch_input").css("display","inline");
                                $('#geosearch_input').typeahead({source: hg19genes});
			       	$("#geo_dialog").html(_data.length + " rows returned");
                                geotable = $('#geotable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "oLanguage": { "sSearch": "Filter Results" },
                                        "aaData": _data,
                                        "aoColumns": [
                                        { "sTitle": "Name" },{ "sTitle": "Annotation" },{ "sTitle": "GEO Samples" }]
                                        });
                        },
                        error: function(){
                                new Messi('Error on data retrieval, please contact help', {title: 'Server error'});
                        }
                });	    
}

function initProtein(){
        var rawdata = "<a href='data/raw/Protein.tsv'>download Protein data</a><br>";
	$('#Protein').html( rawdata + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="proteintable"></table>' );
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_protein.cgi",
                        data: {'experiment_id': 'x'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
					new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _metdata = jo["aaData"];
                                var pTable = $('#proteintable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 50,
                                        "aaData": _metdata,
                                        "aoColumns": [
                                        { "sTitle": "ID" },
					{ "sTitle": "Name" },
					{ "sTitle": "Alias" },
                                        { "sTitle": "Abundance" }]
                                        });
				pTable.fnSort( [ [3,'desc'] ] );
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });

}

function initMetabolomics(){
	var rawdata = "<a href='data/raw/Metabolomics.tsv'>download Metabolomics data</a><br>";
	$('#Metabolite').html( rawdata + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="mettable"></table>' );
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_metabolomic.cgi",
                        data: {'experiment_id': 'x'},
                        success: function(json)
                        {
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
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}


function initSequencing(){
	var rawlink = '<a href="data/raw/shsy5y.short_variants.fa.gz">Download Fasta (gz)</a>&nbsp;<a href="data/raw/shsy5y.short_variants.fa.fai">index</a><br>';
	$('#Sequencing').html(rawlink + 'Get Gene sequence: <input type="search" name="seqsearch" id="seqsearch" data-provide="typeahead" data-items="10"  TITLE="Input Gene name or Refseq or ENSEMBL ids" style="display:inline;" placeholder="Name or Identifier">&nbsp; Zygosity: <select id="seqsource" style="display:inline;"><option value="all">All</option><option value="homozygous">Homozygous</option><option value="heterozygous">Heterozygous</option></select><button onclick="getSequence()" style="display:inline;">&nbsp;Go</button><br><span id="geneseq_dialog"></span><textarea style="width: 100%; height: 600px;" rows="40" cols="800" id="sequencecontainer"></textarea>');
	$('#seqsearch').typeahead({source: hg19genes}); 
}

function getSequence(){
    var genein = $('#seqsearch').val();
    if (genein.length < 2){
    	new Messi('Please enter a valid gene name or partial string of at least 2 characters...', {title: 'Validation error'});
    	return;
    }
    $( "#geneseq_dialog" ).html("<img src='images/progress.gif' />");
        var seqsource = $("#seqsource").val();
        $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_geneseq.cgi",
                        data: {'parameter': genein.toUpperCase(), 'seqsource':seqsource},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){
                                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                $("#geneseq_dialog").html(_data.length + " results found.");
				if (_data.length == 0){
				    $("#geneseq_dialog").html("For " + genein.toUpperCase() + ", SH-SY5Y cellline did not find sequence differences with reference");
				}
				var _out = "";
				for (var i = 0; i < _data.length; i++){
				    _out = _out + _data[i][0] + " Zygosity:" + _data[i][1] + "&#13;&#10;" + _data[i][2] + "&#13;&#10;&#13;&#10;";   
				}
				$("#sequencecontainer").html(_out);
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

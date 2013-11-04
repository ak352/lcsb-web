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
                                        { "sTitle": "Chromosome" },{ "sTitle": "Begin" },{ "sTitle": "End" },
                                        { "sTitle": "Var_Type" },{ "sTitle": "Reference" }, { "sTitle": "Allele_Seq" },{ "sTitle": "Complete_Genomics" },{ "sTitle": "Illumina" },{ "sTitle": "XRef" }]
                                        });
                        },
                        error: function(){
                        new Messi('Error on data retrieval, please contact help', {title: 'Server error'});}
                });
}

function initSNP(){

      var rawdata = "<a href='data/raw/SNP.gz'>download SNP data (gzip)</a><br>";
        // chromosome, begin, end, var_type, reference, allele_seq, complete_genomics, illumina, xref $("#SNP").append(rawdata + "<br>Filter on SNPs and Indels");
	var searchin = '&nbsp;<input type="search" style="display:block;width:250px;" size="200" name="search_input" id="search_input" TITLE="By default, Search does partial match on selected snp columns. The advanced column function allows for custom selects, essentially the field becomes a free where clause meaning that syntax must be correct, each of the column header below exactly match a column in the db, such as xref = xref. Multiple columns and using AND OR clause are ok. Text(String) fields require single quotes and LIKE requires %"  placeholder="Enter value">';
        var columns = 'Column: <select id = "columns" name="columns" style="display:inline"><option value="chromosome">Chr</option><option value="begin">Begin</option><option value="end">End</option><option value="var_type">VarType</option><option value="reference">Reference</option><option value="allele_seq">AlleleSeq</option><option value="complete_genomics">CompleteGenomics</option><option value="illumina">Illumina</option><option value="xref">XRef</option><option value = "advanced">Advanced</option></select>';
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
                                $('#snptable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
					"oLanguage": { "sSearch": "Filter Results" },    
                                        "aaData": _data,
                                        "aoColumns": [
                                        { "sTitle": "Chromosome" },{ "sTitle": "Begin" },{ "sTitle": "End" },
                                        { "sTitle": "VarType" },{ "sTitle": "Reference" }, { "sTitle": "Allele_Seq" },{ "sTitle": "Complete_Genomics" },{ "sTitle": "Illumina" },{ "sTitle": "XRef" }]
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
                                        { "sTitle": "End" },
                                        { "sTitle": "Avg Normalized Coverage", "sClass": "center" },
					{ "sTitle": "Relative Coverage", "sClass": "center" },
                                        { "sTitle": "Called Level" },{ "sTitle": "Level Score" } ]
                                        });
				   cTable.fnSort( [ [3,'asc'], [0,'asc'], [1,'asc'] ] ); 
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
	var rawdata = "<a href='data/raw/STV.tsv'>Download SV data</a><br>";//Frequency:<input type='range' id='freqrange' name='freqrabge' min='0' max='1' step='.01' value='.5' onchange='freqchange();'>";
        var klinks = "<a href='images/cn_annotations.png'><img src='images/cn_annotations.png' alt='pomo rings' height='400' width='400'></a><br>";
   $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 1,
step:.01,
      values: [ .01, .99 ],
      stop: function( event, ui ) {
        $( "#freqspan" ).html(rawdata + "Frequency Range Filter:" + ui.values[ 0 ] + "-" + ui.values[ 1 ] );
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
                                        { "sTitle": "LeftChr" },
                                        { "sTitle": "Position" },
                                        { "sTitle": "Length" },
                                        { "sTitle": "RightChr" },
                                        { "sTitle": "Position" },
                                        { "sTitle": "Length" },
                                        { "sTitle": "Type" },
                                        { "sTitle": "FrequencyInBaseline" },
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
	$('#STV').append( '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="stvtable"></table>' + klinks );         	
	$.ajax({
                type: "POST",
                url:  "/cgi-bin/get_stv.cgi",
                        data: {'experiment_id': 'x'},
                        success: function(json)
                        {
                                if ($.parseJSON(json) == null){new Messi('Error on retrieving structural variations', {title: 'Server error'});}
                                var jo  = $.parseJSON(json);
                                var _stvdata = jo["aaData"];
                                stvTable = $('#stvtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "aaData": _stvdata,
                                        "aoColumns": [
                                        { "sTitle": "LeftChr" },
					{ "sTitle": "Position" },
                                        { "sTitle": "Length" },
					{ "sTitle": "RightChr" },
                                        { "sTitle": "Position" },
                                        { "sTitle": "Length" },
					{ "sTitle": "Type" },
					{ "sTitle": "FrequencyInBaseline" },
                                        { "sTitle": "AssembledSequence" }
                                        ]
					/*,
					"aoColumnDefs": [
					      { "sType": "freq-num", "aTargets": [ 7 ] }
					          ]*/
				});
				//stvTable.fnSort( [ [7,'desc']] );
                        },
                        error: function(){
                                alert("Error retrieving experiment group details");
                        }
                });
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
                                        { "sTitle": "Locus" },{ "sTitle": "FPKM" }, { "sTitle": "FPKM_Conf_Lo" },{ "sTitle": "FPKM_Conf_Hi" },{ "sTitle": "TSS" }]
                                        });
				rnatable.fnSort( [ [3,'desc']] );
			},
                        error: function(){
                        	new Messi('Error on data retrieval, please contact help', {title: 'Server error'});
			}
                });
}

var rnatable;
function initRNASeq(){
        var rawdata = "<a href='data/raw/RNASeq.gz'>download RNASeq data (gzip)</a><br>";
	var searchin = '&nbsp;<input type="search" style="display:block;width:250px;" size="200" name="search_input" id="rnasearch_input" TITLE="By default, Search does partial match on selected columns. The advanced column function allows for custom selects, essentially the field becomes a free where clause meaning that syntax must be correct, each of the column header below match a column in the db, such as FPKM = FPKM. Multiple columns and using AND OR clause are ok. Text(String) fields require single \' quotes and LIKE requires % numeric fields can take >, < values without quotes"  placeholder="Enter value">';
	var columns = 'Column: <select id = "rnacolumns" name="rnacolumns" style="display:inline"><option value="id">Id</option><option value="name">Name</option><option value="locus">Locus</option><option value="fpkm">FPKM</option><option value="fpkm_conf_lo">FPKM_Conf_Lo</option><option value="fpkm_conf_high">FPKM_Conf_Hi</option><option value="tss">TSS</option><option value = "advanced">Advanced</option></select>';
        var button = '&nbsp;<button id="searchRNA" value="Filter" onClick="searchRNASeq()">Search</button>&nbsp;<span id="rna_dialog"></span>';
        $('#RNASeq').html( rawdata + '<br>' + columns + searchin + button + '<br><table cellpadding="0" cellspacing="0" border="0" class="display" id="rnaseqtable"></table>' );
	$( "#rna_dialog" ).html("<img src='images/progress.gif' />");
        //id, name, tss, locus, fpkm, fpkm_conf_lo, fpkm_conf_high 
	  $.ajax({
                type: "POST",
                url:  "/cgi-bin/get_rnaseq.cgi",
                        data: {'exp': 'na'},
                        success: function(json)
                        {
                                var jo  = $.parseJSON(json);
                                var _data = jo["aaData"];
                                $("#rnasearch_input").css("display","inline");
                                $("#rna_dialog").html(_data.length + " rows returned");
                                rnatable = $('#rnaseqtable').dataTable( {
                                        "bProcessing": true,
                                        "bDestroy": true,
                                        "iDisplayLength": 25,
                                        "oLanguage": { "sSearch": "Filter Results" },
                                        "aaData": _data,
                                        "aoColumns": [
                                        { "sTitle": "Id" },{ "sTitle": "Name" },
                                        { "sTitle": "Locus" },{ "sTitle": "FPKM" }, { "sTitle": "FPKM_Conf_Lo" },{ "sTitle": "FPKM_Conf_Hi" },{ "sTitle": "TSS" }]
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

function initMicroarray(){
        var rawdata = "<a href='data/raw/microarray_gse9169.gz'>download Microarray_GSE9169 </a>&nbsp;<a href='data/raw/microarray_shsy5y.gz'>SH-SY5Y (gzip)</a><br>";
        $("#Microarray").append(rawdata +"<br>Sample Details on GEO"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102825' target='_blank'>GSM102825</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102842' target='_blank'>GSM102842</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102870' target='_blank'>GSM102870</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102875' target='_blank'>GSM102875</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102876' target='_blank'>GSM102876</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102877' target='_blank'>GSM102877</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102878' target='_blank'>GSM102878</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102879' target='_blank'>GSM102879</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102880' target='_blank'>GSM102880</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102881' target='_blank'>GSM102881</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102882' target='_blank'>GSM102882</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM102883' target='_blank'>GSM102883</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178569' target='_blank'>GSM178569</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178570' target='_blank'>GSM178570</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178571' target='_blank'>GSM178571</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178572' target='_blank'>GSM178572</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178573' target='_blank'>GSM178573</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178574' target='_blank'>GSM178574</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178575' target='_blank'>GSM178575</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178576' target='_blank'>GSM178576</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178577' target='_blank'>GSM178577</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178578' target='_blank'>GSM178578</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178579' target='_blank'>GSM178579</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178580' target='_blank'>GSM178580</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178581' target='_blank'>GSM178581</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178582' target='_blank'>GSM178582</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178583' target='_blank'>GSM178583</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178584' target='_blank'>GSM178584</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178585' target='_blank'>GSM178585</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178586' target='_blank'>GSM178586</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178587' target='_blank'>GSM178587</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178588' target='_blank'>GSM178588</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178589' target='_blank'>GSM178589</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178590' target='_blank'>GSM178590</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178591' target='_blank'>GSM178591</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178592' target='_blank'>GSM178592</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178593' target='_blank'>GSM178593</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178594' target='_blank'>GSM178594</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178595' target='_blank'>GSM178595</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178596' target='_blank'>GSM178596</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178597' target='_blank'>GSM178597</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178598' target='_blank'>GSM178598</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178599' target='_blank'>GSM178599</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178600' target='_blank'>GSM178600</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178601' target='_blank'>GSM178601</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178602' target='_blank'>GSM178602</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178603' target='_blank'>GSM178603</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178604' target='_blank'>GSM178604</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178605' target='_blank'>GSM178605</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178606' target='_blank'>GSM178606</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM178607' target='_blank'>GSM178607</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231608' target='_blank'>GSM231608</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231609' target='_blank'>GSM231609</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231610' target='_blank'>GSM231610</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231611' target='_blank'>GSM231611</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231612' target='_blank'>GSM231612</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231613' target='_blank'>GSM231613</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231614' target='_blank'>GSM231614</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231615' target='_blank'>GSM231615</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231616' target='_blank'>GSM231616</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231617' target='_blank'>GSM231617</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231618' target='_blank'>GSM231618</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231619' target='_blank'>GSM231619</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231620' target='_blank'>GSM231620</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231621' target='_blank'>GSM231621</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231622' target='_blank'>GSM231622</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231623' target='_blank'>GSM231623</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231624' target='_blank'>GSM231624</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231625' target='_blank'>GSM231625</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231626' target='_blank'>GSM231626</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231627' target='_blank'>GSM231627</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231628' target='_blank'>GSM231628</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231629' target='_blank'>GSM231629</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231630' target='_blank'>GSM231630</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231631' target='_blank'>GSM231631</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231632' target='_blank'>GSM231632</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231633' target='_blank'>GSM231633</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231634' target='_blank'>GSM231634</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231635' target='_blank'>GSM231635</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231636' target='_blank'>GSM231636</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231637' target='_blank'>GSM231637</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231638' target='_blank'>GSM231638</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231639' target='_blank'>GSM231639</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231640' target='_blank'>GSM231640</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231641' target='_blank'>GSM231641</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231642' target='_blank'>GSM231642</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231643' target='_blank'>GSM231643</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231644' target='_blank'>GSM231644</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231645' target='_blank'>GSM231645</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231646' target='_blank'>GSM231646</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231647' target='_blank'>GSM231647</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231648' target='_blank'>GSM231648</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231649' target='_blank'>GSM231649</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231650' target='_blank'>GSM231650</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231651' target='_blank'>GSM231651</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231652' target='_blank'>GSM231652</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231653' target='_blank'>GSM231653</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231654' target='_blank'>GSM231654</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231655' target='_blank'>GSM231655</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231656' target='_blank'>GSM231656</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231657' target='_blank'>GSM231657</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231658' target='_blank'>GSM231658</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231659' target='_blank'>GSM231659</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231660' target='_blank'>GSM231660</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231661' target='_blank'>GSM231661</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231662' target='_blank'>GSM231662</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231663' target='_blank'>GSM231663</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231664' target='_blank'>GSM231664</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231665' target='_blank'>GSM231665</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231666' target='_blank'>GSM231666</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231667' target='_blank'>GSM231667</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231668' target='_blank'>GSM231668</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231669' target='_blank'>GSM231669</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231670' target='_blank'>GSM231670</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231671' target='_blank'>GSM231671</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231672' target='_blank'>GSM231672</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231673' target='_blank'>GSM231673</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231674' target='_blank'>GSM231674</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231675' target='_blank'>GSM231675</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231676' target='_blank'>GSM231676</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231677' target='_blank'>GSM231677</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231678' target='_blank'>GSM231678</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231679' target='_blank'>GSM231679</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231680' target='_blank'>GSM231680</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231681' target='_blank'>GSM231681</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231682' target='_blank'>GSM231682</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231683' target='_blank'>GSM231683</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231684' target='_blank'>GSM231684</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231685' target='_blank'>GSM231685</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231686' target='_blank'>GSM231686</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231687' target='_blank'>GSM231687</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231688' target='_blank'>GSM231688</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231689' target='_blank'>GSM231689</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231690' target='_blank'>GSM231690</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231691' target='_blank'>GSM231691</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231692' target='_blank'>GSM231692</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM231693' target='_blank'>GSM231693</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM247508' target='_blank'>GSM247508</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM247513' target='_blank'>GSM247513</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM247514' target='_blank'>GSM247514</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM247515' target='_blank'>GSM247515</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM247516' target='_blank'>GSM247516</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM247517' target='_blank'>GSM247517</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282582' target='_blank'>GSM282582</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282583' target='_blank'>GSM282583</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282584' target='_blank'>GSM282584</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282585' target='_blank'>GSM282585</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282586' target='_blank'>GSM282586</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282587' target='_blank'>GSM282587</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282588' target='_blank'>GSM282588</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282589' target='_blank'>GSM282589</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282590' target='_blank'>GSM282590</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282591' target='_blank'>GSM282591</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM282592' target='_blank'>GSM282592</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM335161' target='_blank'>GSM335161</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM335162' target='_blank'>GSM335162</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM335163' target='_blank'>GSM335163</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM335164' target='_blank'>GSM335164</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM361562' target='_blank'>GSM361562</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM361563' target='_blank'>GSM361563</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM417814' target='_blank'>GSM417814</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM417815' target='_blank'>GSM417815</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM417816' target='_blank'>GSM417816</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM417817' target='_blank'>GSM417817</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM417818' target='_blank'>GSM417818</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM417819' target='_blank'>GSM417819</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420244' target='_blank'>GSM420244</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420245' target='_blank'>GSM420245</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420246' target='_blank'>GSM420246</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420247' target='_blank'>GSM420247</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420248' target='_blank'>GSM420248</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420249' target='_blank'>GSM420249</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420250' target='_blank'>GSM420250</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420251' target='_blank'>GSM420251</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420252' target='_blank'>GSM420252</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420253' target='_blank'>GSM420253</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420254' target='_blank'>GSM420254</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM420255' target='_blank'>GSM420255</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430339' target='_blank'>GSM430339</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430340' target='_blank'>GSM430340</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430341' target='_blank'>GSM430341</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430342' target='_blank'>GSM430342</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430343' target='_blank'>GSM430343</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430344' target='_blank'>GSM430344</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430345' target='_blank'>GSM430345</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM430346' target='_blank'>GSM430346</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453305' target='_blank'>GSM453305</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453306' target='_blank'>GSM453306</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453307' target='_blank'>GSM453307</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453308' target='_blank'>GSM453308</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453309' target='_blank'>GSM453309</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453310' target='_blank'>GSM453310</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453311' target='_blank'>GSM453311</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453312' target='_blank'>GSM453312</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453313' target='_blank'>GSM453313</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453314' target='_blank'>GSM453314</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453315' target='_blank'>GSM453315</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453316' target='_blank'>GSM453316</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453605' target='_blank'>GSM453605</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453606' target='_blank'>GSM453606</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453607' target='_blank'>GSM453607</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453608' target='_blank'>GSM453608</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453609' target='_blank'>GSM453609</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453610' target='_blank'>GSM453610</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453611' target='_blank'>GSM453611</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453612' target='_blank'>GSM453612</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453613' target='_blank'>GSM453613</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453614' target='_blank'>GSM453614</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453616' target='_blank'>GSM453616</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453617' target='_blank'>GSM453617</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453618' target='_blank'>GSM453618</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453619' target='_blank'>GSM453619</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453620' target='_blank'>GSM453620</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453621' target='_blank'>GSM453621</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453622' target='_blank'>GSM453622</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453623' target='_blank'>GSM453623</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453624' target='_blank'>GSM453624</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453625' target='_blank'>GSM453625</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453626' target='_blank'>GSM453626</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453627' target='_blank'>GSM453627</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453628' target='_blank'>GSM453628</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM453629' target='_blank'>GSM453629</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM53382' target='_blank'>GSM53382</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM53383' target='_blank'>GSM53383</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM53384' target='_blank'>GSM53384</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM53385' target='_blank'>GSM53385</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM53386' target='_blank'>GSM53386</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM53387' target='_blank'>GSM53387</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603226' target='_blank'>GSM603226</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603227' target='_blank'>GSM603227</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603228' target='_blank'>GSM603228</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603229' target='_blank'>GSM603229</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603230' target='_blank'>GSM603230</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603231' target='_blank'>GSM603231</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603232' target='_blank'>GSM603232</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603233' target='_blank'>GSM603233</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603234' target='_blank'>GSM603234</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603236' target='_blank'>GSM603236</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603237' target='_blank'>GSM603237</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603238' target='_blank'>GSM603238</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603239' target='_blank'>GSM603239</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603240' target='_blank'>GSM603240</a>"
	    +"<br>&nbsp;<a href='http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSM603241' target='_blank'>GSM603241</a>"
	    );
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
					{ "sTitle": "Alias" },
                                        { "sTitle": "Abundance" }]
                                        });
				pTable.fnSort( [ [2,'desc'] ] );
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

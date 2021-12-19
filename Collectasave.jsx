// SPDX-License-Identifier: MIT
// Title: Collectasave
// Author: Franky's Fries (github.com/frankysfries/)
#include "../Modules/json2.js";

var product;
var productName = app.name;

if(productName.indexOf('Illustrator') >= 0){
	product = 'Illustrator';
}
else if(productName.indexOf('Photoshop') >= 0){
	product = 'Photoshop';
}
else{
	product = false;
}
if(product){
	if(documents.length == 0){
		alert('Please select a document.');
		//break process;
	}
	else{
		init();
	}
}
else{
	alert("An error occurred determining which application you're using. Collectasave is compatible with Photoshop and Illustrator only.");
}

function init(){
	var folderPaths = ['/data/', '/data/svg_layers', '/assets/', '/assets/artwork', '/assets/metadata'];
	var docRef = app.activeDocument;
	var appPath = docRef.path;
	var mappingPath = File(appPath + "/data/mapping.json");
	var collectionSize = 0;
	var collectionName = '';
	var metadataPath = '';
	var dataMatch = false;
	var layerGroups, data, totalCombinations, exportList, fileExt, msg;
	for(var i = 0; i < folderPaths.length; i++){
		var folder = new Folder(appPath + folderPaths[i]);
		if(!folder.exists){
			folder.create();
		}
	}


	// ---------------------------------------------------------------------------------
	// MAPPINGS
	// ---------------------------------------------------------------------------------
	function layerMapping(){
		var traits;
		var artworkStructure = [];
		if(product == 'Illustrator'){
			traits = docRef.layers;
		}
		else if(product == 'Photoshop'){
			traits = docRef.layerSets;
		}
		if(traits.length){
			for(var i = 0; i < traits.length; i++){
				var traitObj = {
					"trait": traits[i],
					"attributes": []
				}
				var attributes;
				if(product == 'Illustrator'){
					attributes = traits[i].layers;
				}
				else if(product == 'Photoshop'){
					attributes = traits[i].layerSets;
				}
				if(attributes.length){
					for(var j = 0; j < attributes.length; j++){
						traitObj.attributes.push(attributes[j]);
					}
					artworkStructure.push(traitObj);
				}else{
					alert('A trait in your artwork is missing content.');
					break;
				}
			}
		}else{
			alert('Unable to read layer structure in your artwork.');
		}
		return artworkStructure;
	}
	layerGroups = layerMapping();

	function openData(file){
		var currentLine;
	    var jsonContents = [];
	    file.open("r");

	    while(!file.eof){
	        currentLine = file.readln();
	        jsonContents.push(currentLine);
	    }
		if(jsonContents.length == 0){
			return false;
		}else{
		    file.close();
		    jsonContents = jsonContents.join("");
		    var parsedJson = JSON.parse(jsonContents);
		    return parsedJson;
		}
	}

	function saveData(p, f){
		p.open("w");
		p.write(JSON.stringify(f));
		p.close();
	}

	function compareData(){
		for(var i = 0; i < data.length; i++){
			if(layerGroups[i].length){
				var artworkTrait = layerGroups[i].trait.name;
				var attrsLen = data[i].length - 1;
				if(attrsLen && attrsLen == layerGroups[i].attributes.length){
					for(var j = 0; j < attrsLen; j++){
						var artworkVariant = layerGroups[i].attributes[j].name;
						if(data[i][j].variant != artworkVariant || data[i][j].trait != artworkTrait){
							return false;
						}
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		}
		return true;
	}

	data = openData(mappingPath);
	if(data){
		dataMatch = compareData();
	}
	if(!dataMatch || !data){
		createMapping(mappingPath);
		data = openData(mappingPath);
	}

	// Save out a mapping in JSON format based on layer names and hierarchy in artwork file
	function createMapping(p){
		var mappingArr = [];
		for(var i = 0; i < layerGroups.length; i++){
			var topLayer = [];
			var subLen = layerGroups[i].attributes.length;
			if(subLen){
				var rarityPct = 100 / subLen;
				for(var j = 0; j < subLen; j++){
					// Record layer indexes since we can't target layers by name in Illustrator
					var layerDetails = {variant: layerGroups[i].attributes[j].name, rarity: rarityPct, rarityTotal: 0, counter: 0, diff: 0, trait: layerGroups[i].trait.name};
					topLayer.push(layerDetails);
				}
				// Add array containing trait details
				topLayer.push({variant: false, rarity: 0, rarityTotal: 0, counter: 0, diff: 0, trait: layerGroups[i].trait.name});
			}
			mappingArr.push(topLayer);
		}
		saveData(p, mappingArr);
	}

	function updateRarity(cs){
		for(var i = 0; i < data.length; i++){
			var traitLen = data[i].length;
			if(traitLen){
				for(var j = 0; j < traitLen; j++){
					var rPct = data[i][j].rarity;
					data[i][j].rarity = parseFloat(rPct).toFixed(2);
					var newRarityTotal = Math.round(cs * (rPct / 100));
					data[i][j].rarityTotal = newRarityTotal;
					data[i][j].counter = 0;
				}
			}
		}
		saveData(mappingPath, data);
	}

	function report(){
		saveData(File(appPath + "/data/data_report.json"), data);
	}


	// ---------------------------------------------------------------------------------
	// COMPILE/EXPORT
	// ---------------------------------------------------------------------------------
	function layerVisibility(show){
		for(var i = 0; i < layerGroups.length; i++){
			var traitLen = layerGroups[i].attributes.length;
			layerGroups[i].trait.visible = true;
			for(var j = 0; j < traitLen; j++){
				if(show){
					layerGroups[i].attributes[j].visible = true;
				}else{
					layerGroups[i].attributes[j].visible = false;
				}
			}
		}
	}

	function getTotalCombinations(){
		var newTotal = 1;
		for(var i = 0; i < data.length; i++){
			var subLen = data[i].length;
			if(subLen){
				newTotal = newTotal * subLen;
			}
		}
		return newTotal;
	}
	totalCombinations = getTotalCombinations();

	function randomize(arr){
		// F-Y shuffle
		var m = arr.length, t, i;
		while(m) {
			i = Math.floor(Math.random() * m--);
			t = arr[m];
			arr[m] = arr[i];
			arr[i] = t;
		}
		return arr;
	}

	function getRandomInt(min, max){
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function qualifyPct(row, threshhold){
		// row example: [1, 3, 0, 4, 2, 0, 6], array position are traits section indexes, values are trait attribute indexes
		var cnt = 0;
		for(var i = 0; i < row.length; i++){
			var attrInd = data[i][row[i]];
			var counter = attrInd.counter;
			var rarity = attrInd.rarity;
			var rarityTotal = attrInd.rarityTotal;
			if(counter >= rarityTotal){
				cnt++;
			}
			if(parseFloat(rarity) == 0.01 && rarityTotal = 1){
				return false;
			}
		}
		if(cnt > threshhold){
			return false;
		}else{
			return true;
		}
	}

	function generateRow(){
		var rowArr = [];
		var row = '[';
		// Loop through trait sections adding random number to each slot to create a row
		for(var j = 0; j < data.length; j++){
			// If 'None' has no % defined, skip
			var l = 1;
			var lastArr = data[j][data[j].length - 1];
			if(!lastArr.variant && lastArr.rarity == 0){
				l = 2;
			}
			var ri = getRandomInt(0, data[j].length - l);
			rowArr.push(ri);
			if(j == 0){
				row += ri + '';
			}else{
				row += ', ' + ri + '';
			}
		}
		row += ']';
		row.replace(/ /g, '');
		return [rowArr, row];
	}

	function addRows(len, threshhold, totalCount){
		for(var i = 0; i < len; i++){
			var gr = generateRow();
			var rowArr = gr[0];
			var row = gr[1];
			row.replace(/ /g, '');

			// Check if newly generated row has already been added to export list
			if(exportList.indexOf(row) == -1){
				if(qualifyPct(rowArr, threshhold)){
					for(var m = 0; m < rowArr.length; m++){
						var r = data[m][rowArr[m]];
						r.counter++;
						r.diff = r.rarityTotal - r.counter;
					}
					row.replace(/ /g, '');
					exportList += row + ',';
					totalCount++;
				}
			}
			if(totalCount == collectionSize){
				break;
			}
		}
		return totalCount;
	}

	function compileCombinations(){
		var totalCount = 0;
		exportList = '[';// Create export list as string for better performance
		var limit = getTotalCombinations();
		var threshhold = 0;

		for(var i = 0; i < data.length; i++){
			if(totalCount < collectionSize){
				var len = collectionSize;
				if(i <= 2){
					len = limit;
				}
				totalCount = addRows(len, threshhold, totalCount);
				threshhold++;
			}
			else{
				break;
			}
		}

		exportList += ']';

		// Create JS for debugging duplicates later
		var exportListJs = 'const exportList = ' + exportList;
		var p1 = File(appPath + "/data/export_list.js");
		p1.open("w");
		p1.write(exportListJs);
		p1.close();

		exportList = JSON.parse(exportList);

		// Write files
		saveData(File(appPath + "/data/export_list.json"), exportList);
	}

	function createSVGStructure(){
		// Create base SVG
		layerVisibility(true);
		var options = new ExportOptionsSVG();
		var imagePath = new File(appPath + "/data/svg_layers/base.svg");
		var exType = ExportType.SVG;
		docRef.exportFile(imagePath, exType);

		// Holds exported SVG of all layers
		var svgContents;
		var path = File(appPath + "/data/svg_layers/base.svg");
		path.open("r");
		var s = path.read();
		s.toString();
		s = s.replace('xmlns="http://www.w3.org/2000/svg"','');// Remove this, it breaks parsing
		var svgContents = new XML(s);
		path.close();

		// Create array of layers in string format
		var svgLayers = [];
		for(var i = 0; i < svgContents.g.length(); i++){
			var layerIndexes = [];
			for(var j = 0; j < svgContents.g[i].g.length(); j++){
				var layerXML = svgContents.g[i].g[j].toXMLString();
				layerIndexes.push(layerXML);
			}
			layerIndexes.reverse();
			svgLayers.push(layerIndexes);
		}
		svgLayers.reverse();

		// Save out layers to txt file and remove layers from shell
		for(var i = 0; i < svgLayers.length; i++){
			for(var j = 0; j < svgLayers[i].length; j++){
				var f = svgLayers[i][j].toString().replace(' xmlns:xlink="http://www.w3.org/1999/xlink"', '');
				var p = File(appPath + "/data/svg_layers/" + i + "-" + j + ".txt");
				p.open("w");
				p.write(f);
				p.close();
				f = '';
			}
		}
		svgLayers = [];

		// Write SVG shell
		var p = File(appPath + "/data/svg_layers/shell.txt");
		p.open("w");
		p.write(svgContents.toString());
		p.close();
		svgContents = [];
	}

	function exportArt(){
		if(fileExt == '.svg'){
			createSVGStructure();
		}

		// Construct SVG as string to avoid inconsitent SVG parser
		var svgHeader = '<?xml version="1.0" encoding="iso-8859-1"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ' + docRef.width + ' ' + docRef.height + '" style="enable-background:new 0 0 ' + docRef.width + ' ' + docRef.height + ';" xml:space="preserve">';

		for(var i = 0; i < exportList.length; i++){
			// Strip punctuation, repalce spaces with underscores
			var fileTitle = collectionName.replace(/[.,\/#'!$%\^&\*;:{}=\-_`~()]/g,"").replace(" ", "_");
			var filename = (i + 1) + '_' + fileTitle/* + '_' + Math.floor(Math.random() * (999999 - 100000)) + 100000*/;
			// Construct SVG. SVG's are stacked in reverse...

			if(fileExt == '.svg'){
				var svgForExport = '';
				var exLen = exportList[i].length - 1;
				for(var j = exLen; j >= 0; j--){
					var svgLayer = '<g id="Layer_cs_' + j + '">';
					var p = File(appPath + "/data/svg_layers/" + j + "-" + exportList[i][j] + ".txt");
					p.open("r");
					var s = p.read();
					p.close();
					svgLayer += s + '</g>';
					svgForExport += svgLayer;
				}
				svgForExport = svgHeader + svgForExport + '</svg>';
				var ps = File(appPath + "/assets/artwork/" + filename + fileExt);
				ps.open("w");
				ps.write(svgForExport);
				ps.close();
			}
			else if(fileExt == '.png'){
				layerVisibility(false);
				for(var j = 0; j < exportList[i].length; j++){
					var layerInd = exportList[i][j];
					// Last index in data is for 'None' layer...
					if(layerInd < data[j].length -1){
						layerGroups[j].attributes[layerInd].visible = true;
					}
				}

				var options;
				if(product == 'Illustrator'){
					options = new ExportOptionsPNG24();
					var ps = new File(appPath + "/assets/artwork/" + filename + fileExt);
					var exType = ExportType.PNG24;
					docRef.exportFile(ps, exType);
				}else{
					options = new ExportOptionsSaveForWeb();
					options.format = SaveDocumentType.PNG;
					options.includeProfile = false;
					options.interlaced = false;
					options.PNG8 = false;
					options.transparency = true;
					var ps = new File(appPath + "/assets/artwork/" + filename + fileExt);
					docRef.exportDocument(ps, ExportType.SAVEFORWEB, options);
				}
			}

			// Metadata
			var metaObj = {
				"description": "",
				"image": "",
				"name": "",
				"attributes": []
			}
			metaObj.description = collectionName;
			metaObj.image = metadataPath + filename + fileExt;
			metaObj.name = collectionName + ' ' + (i + 1);

			for(var k = 0; k < exportList[i].length; k++){
				var trait = {};
				trait["trait_type"] = data[k][0].trait;
				trait["value"] = data[k][exportList[i][k]].variant;
				metaObj.attributes.push(trait);
			}

			saveData(File(appPath + "/assets/metadata/" + filename + ".json"), metaObj);
		}

	}


	// ---------------------------------------------------------------------------------
	// DIALOG WINDOW
	// ---------------------------------------------------------------------------------
	var treeTraitInd, treeAttrInd, selectedItem;
	var noneInd = [];
	var w = new Window('dialog {text: "Collectasave", alignChildren: ["fill", "top"]}');
	var container = w.add('group {alignChildren: ["left", "top"]}');

	// Left side -------------------------------

	var p_left = container.add("panel" , undefined , "Collection Settings");
	p_left.size = [300, 500];
	p_left.orientation = "column";
	p_left.margins = [0, 25, 0, 0];

	var collectionDescription = p_left.add("group");
	collectionDescription.size = [270, 30];
	collectionDescription.margins = [0, 0, 0, 50];
	var descriptionText = collectionDescription.add("statictext", undefined, 'For instructions, please visit github.com/frankysfries/collectasave', { multiline: true });
	descriptionText.size = [270, 80];

	var d_collectionName = p_left.add("panel", undefined, "Collection Name");
	d_collectionName.size = [270,70];
	d_collectionName.alignChildren = 'left';
	var d_collectionNameField = d_collectionName.add("edittext", undefined, collectionName);
	d_collectionNameField.minimumSize.width = 244;
	d_collectionName.margins = [15, 20, 15, 20];

	var d_collectionSize = p_left.add("panel", undefined, "Collection Size");
	d_collectionSize.size = [270,100];
	d_collectionSize.alignChildren = 'left';
	var d_collectionSizeField = d_collectionSize.add("edittext", undefined, collectionSize);
	d_collectionSizeField.minimumSize.width = 244;
	d_collectionSize.margins = [15, 20, 15, 20];
	var d_combos = d_collectionSize.add("statictext", undefined, totalCombinations + ": possible combinations");
	d_combos.minimumSize.width = 170;

	var d_collectionPath = p_left.add("panel", undefined, "Metadata Path");
	d_collectionPath.size = [270,70];
	d_collectionPath.alignChildren = 'left';
	var d_collectionPathField = d_collectionPath.add("edittext", undefined, "");
	d_collectionPathField.minimumSize.width = 244;
	d_collectionPath.margins = [15, 20, 15, 20];

	var d_exportFormat = p_left.add("panel", undefined, "File Format");
	d_exportFormat.size = [270,70];
	d_exportFormat.alignChildren = 'left';
	var d_exportFormat1 = d_exportFormat.add("radiobutton", undefined, "Left");
	d_exportFormat1.margins = [0, 15, 0, 0];
	d_exportFormat1.value = true;
	var d_exportFormat2 = d_exportFormat.add("radiobutton", undefined, "Left");
	if(product == 'Illustrator'){
		d_exportFormat1.text = ".SVG (Vector artwork only)";
		d_exportFormat2.text = ".PNG (Slow)";
	}
	if(product == 'Photoshop'){
		d_exportFormat1.text = ".PNG";
		d_exportFormat2.text = ".JPG";
		d_exportFormat2.visible = false;
	}

	// Right side -------------------------------

	var p_right = container.add("panel" , undefined , "Artwork Traits");
	p_right.size = [450,500];
	p_right.orientation = "column";

	var g = p_right.add("group");
	g.orientation = "column";
	g.margins = [0, 20, 0, 0];

	var scrollArea = g.add('group {alignChildren: ["left", "top"]}');
	scrollArea.orientation = "column";
	var tree = scrollArea.add('listbox');
	tree.preferredSize = [410,370];

	for(var i = 0; i < data.length; i++){
		var attrsLen = data[i].length;
		if(attrsLen){
			var traitTitle = tree.add("item", "----- " + layerGroups[i].trait.name + " -----");
			for(var j = 0; j < attrsLen; j++){
				var rPct = data[i][j].rarity;
				rPct = parseFloat(rPct).toFixed(2);// Round to 2 decimal points
				var nodeName;
				if(!data[i][j].variant){
					nodeName = 'None';
					noneInd.push(tree.items.length);
				}else{
					nodeName = data[i][j].variant;
				}
				var attrItem = tree.add("item", nodeName + " (" + rPct + "%)");
				attrItem.helpTip = i + '-' + j;
			}
			var rowSpace = tree.add("item", "");
		}
	}

	var treeSettings = scrollArea.add("group");
	treeSettings.orientation = "column";
	treeSettings.size = [410,60];
	treeSettings.margins = [0, 10, 0, 0];

	var treeUpdateTitle = treeSettings.add("statictext", undefined, "Select trait attributes from list above to update their percentages.");
	treeUpdateTitle.minimumSize.width = 410;

	var treeUpdateGroup = treeSettings.add("group");
	treeUpdateGroup.orientation = "row";
	treeUpdateGroup.size = [410,30];

	var treeUpdateField = treeUpdateGroup.add("edittext", undefined, "");
	treeUpdateField.minimumSize.width = 100;

	var updateBtn = treeUpdateGroup.add('button', undefined, 'Update');
	updateBtn.margins = [0, 0, 0, 5];
	updateBtn.size = [70,20];

	treeUpdateGroup.hide();

	// Controls -------------------------------

	var controls = w.add ("group");
	var actions = controls.add ("group");
	controls.alignment = "right";
	var cancel = actions.add ("button", undefined, "Cancel");
	var submit = actions.add ("button", undefined, "Generate Collection ->");


	// ---------------------------------------------------------------------------------
	// DIALOG EVENTS AND FUNCTIONALITY
	// ---------------------------------------------------------------------------------

	// Strip all but numbers from field
	d_collectionSizeField.onChanging = function(){
    	d_collectionSizeField.text = d_collectionSizeField.text.replace(/\D/g, "");
	}

	// Remove quotes
	d_collectionNameField.onChanging = function(){
    	d_collectionNameField.text = d_collectionNameField.text.replace(/['"]+/g, '');
	}
	d_collectionPathField.onChanging = function(){
		d_collectionPathField.text = d_collectionPathField.text.replace(/['"]+/g, '');
	}

	tree.onChange = function(){
		treeInds = tree.selection.helpTip;
		if(treeInds.length){
			treeInds = treeInds.split('-');
			treeTraitInd = treeInds[0];
			treeAttrInd = treeInds[1];
			treeUpdateGroup.show();
			var itemText = tree.selection.text;
			treeUpdateTitle.text = data[treeTraitInd][0].trait + ' -> ' + itemText.replace(/\(.*\)/, '');
			treeUpdateField.text = data[treeTraitInd][treeAttrInd].rarity + '%';
		}else{
			treeUpdateTitle.text = '';
			treeUpdateField.text = '';
		}
	}

	updateBtn.onClick = function(){
		var ftxt = treeUpdateField.text;
		ftxt = parseFloat(ftxt.replace(/[^0-9.]/g, ""));// Only permit numbers and decimals

		// Skip if no value entered or the 'None' = 0
		if(!ftxt && data[treeTraitInd][treeAttrInd].variant){
			alert('Please enter a value.');
		}else if(ftxt > 99.9){
			alert('Limit exceeded. Please reduce to below 99.9%.');
		}else{
			ftxt = getSetPctTotal(ftxt);// Verify % total isn't over 100 and redistribute accordingly
			treeUpdateField.text = ftxt;// Update input field with new val

			// Update data object with new rarirty %'s
			data[treeTraitInd][treeAttrInd].rarity = ftxt;

			// Update tree item text with new %
			var itemText = tree.selection.text;
			tree.selection.text = itemText.replace(/\(.*\)/, '(' + ftxt + '%)');

			// Update status text
			var tut = treeUpdateTitle.text;
			tut = tut.replace(/- Updated successfully-/g,'');
			treeUpdateTitle.text = tut + '- Updated successfully';
		}
	}

	function getSetPctTotal(v){
		v = parseFloat(v.toFixed(2));

		// Get totals based on new value
		var vTotal = 0;
		for(var i = 0; i < data[treeTraitInd].length; i++){
			if(i == treeAttrInd){
				vTotal += v;
			}else{
				vTotal += parseFloat(data[treeTraitInd][i].rarity);
			}
		}
		if(vTotal > 100){
			v -= (vTotal - 100);
			v = v.toFixed(2);
		}
		return v;
	}

	function fillRemainder(){
		for(var i = 0; i < data.length; i++){
			var vTotal = 0;
			for(var j = 0; j < data[i].length; j++){
				vTotal += parseFloat(data[i][j].rarity);
			}
			if(vTotal < 100){
				var noneTotal = 100 - vTotal;
				data[i][data[i].length - 1].rarity = noneTotal;
				var itemText = tree.items[noneInd[i]].text;
				tree.items[noneInd[i]].text = itemText.replace(/\(.*\)/, '(' + noneTotal + '%)');
			}
		}
	}

	function verifyInputs(){
		collectionName = d_collectionNameField.text;
		collectionSize = parseFloat(d_collectionSizeField.text);
		metadataPath = d_collectionPathField.text;
		if(d_exportFormat1.value == true){
			if(product == 'Photoshop'){
				fileExt = '.png';
			}else{
				fileExt = '.svg';
			}
		}else{
			fileExt = '.png';
		}
		if(!d_collectionNameField.text || !collectionName){
			return 'Please enter a collection name.';
		}
		if(!d_collectionSizeField.text || !collectionSize){
			return 'Please specify a collection size.';
		}
		if(!d_collectionPathField.text || !metadataPath){
			return 'Please specify a URL for your assets in your metadata.';
		}
		return true;
	}

	submit.onClick = function(){
		submit.text = 'Loading...';
		fillRemainder();// Fill in 'None' values when trait %'s don't reach 100.
		var vi = verifyInputs();
		if(vi === true){
			updateRarity(collectionSize);// Run again to reset .counter's to 0
			compileCombinations();
			exportArt();
			report();
			alert("Export complete.");
			if(fileExt == '.svg'){
				app.activeDocument.close();
			}
			w.close();
		}else{
			alert(vi);
			submit.text = 'Generate Collection ->';
		}

	}

	w.show();
}

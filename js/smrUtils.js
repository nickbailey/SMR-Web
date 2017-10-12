
// Set up the volume selection list with the possible volume selections,
// and select the default choice. That will be the first in the list,
// or "all volumes" if the list is empty.
function initSearchForm (selectorID, volChoices) {
	var volumeSelector = document.getElementById(selectorID);
	var allVols = document.createElement('option');
	allVols.text = 'All Volumes';
	volumeSelector.add(allVols);
	volChoices.forEach( function(vol) {
		var opt = document.createElement('option');
		opt.text = vol[0];
		volumeSelector.add(opt);
	});
	volumeSelector.selectedIndex =
		volumeSelector.length > 1 ? 1 : 0;
}


// Given the bibliographic data, generate the pdf document's escaped URI
function bibdataToURL(bibdata) {
	var url = docBase + '/' + bibdata.volume;
	if (typeof(bibdata.number) !== 'undefined')
		url += '.' + bibdata.number;
	var authors = bibdata['author'].split(/\s+and\s+/);
	var surnames = [];
	authors.forEach(function (author) {
		surnames.push(latexToUnicode(author.replace(/,.*/g, '').replace(/\s+/g,' ')));
	});
	url += '/' +
		surnames.join(', ') + ': ' +
		bibdata['title'].replace(/\s+/g,' ').replace(/\//g,'-') +
		'.pdf';
	return encodeURI(url);
}

// Convert a bibitem to a BibTeX Citation
function bibitemToCitation(item, volChoices, url=null) {
	item.entryTags['journal'] = journalTitle;
	var number = typeof(item.entryTags['number']) == 'undefined' ?
	               null :
	               item.entryTags['number'];
	item.entryTags['year'] = yearFromVolume(volChoices,
	                                        item.entryTags['volume'],
	                                        number);
	if (url !== null) item.entryTags['url'] = url;
	return bibtexParse.toBibtex([item]);
}

// Normal format is to have the first author family name first,
// other authors in normal order
function formatAuthorList (authors) {
	authors = authors.split(' and ');
	var name_parts = authors[0].split(/,\s*/);
	var html = '<span class="firstauthor"><span class="surname">' + 
	            name_parts[0] + '</span>';
	if (name_parts.length > 1)
		html += ', ' + name_parts[1];
	html += '</span>';
	
	for (var p = 1; p < authors.length; p++) {
		name_parts = authors[p].split(/,\s*/);
		if (p == authors.length - 1)
			html += ' and ';
		else
			html += ', ';
		html += '<span class="otherauthor">';
		if (name_parts.length > 1)
		   html += name_parts[1] + ' ';
		html += '<span class="surname">' + name_parts[0] + '</span></span>';
	}
	//alert(html);
	return html;
}


// Find a list of matching volumes/numbers.
// If there is a match, return its year (2nd element)
// If not, return 'Unpublished'
function yearFromVolume(volChoices, vol, num=null) {
	var idx = volChoices.findIndex( function(choice) {
		return choice[2] == String(vol) &&
		       (num === null || num == 0 || choice[3] == String(num));
	});
	
	return idx >= 0 ? volChoices[idx][1] : 'Unpublished';
}

// Given the search terms, build and return an HTML string
// with links to the matching documents
function searchResults(bibliography, volChoices,
                       vol, num, author, title) {
	var html = '<ul class="results">\n';
	var popup_html = '';
	var popup = 0;
	
	// We have to remember the current volume/number.
	// If multiple volumes are being searched, we have
	// to print out extra information
	
	var currentIssue = [-1,-1]; // Initially always show
	
	bibliography.forEach( function(bibitem) {
		var bibdata = bibitem.entryTags;
		if (bibitem.entryType == 'article') {

			// See if we're going to ignore it
			var ok = true;
			
			// Check the volume matches
			if (vol > 0) {
				if (vol != parseInt(bibdata.volume)) ok = false;
				else {
					// Volume's OK. What about the number?
					if (num != null &&
					    typeof(bibdata.number) != 'undefined' && 
					    num != parseInt(bibdata.number)) ok = false;
				}
			}
			
			function required(textField) {
				return !(textField == '' || textField == '(any)');
			};
			
			// Check Author is present
			if (required(author) &&
			    bibdata['author'].toUpperCase().search(author.toUpperCase()) == -1)
			    	ok = false;
			
			// Check Title matches
			if (required(title) &&
			    bibdata['title'].toUpperCase().search(title.toUpperCase()) == -1)
			    	ok = false;
			
			//console.log(ok);
			if (ok) {
				var itemVolume = parseInt(bibdata['volume']);
				var itemNumber = typeof bibdata['number'] !== 'undefined' ?
				                    parseInt(bibdata['number']) : 0;

				// Need to flag new volume?
				if (vol == 0 && // Only if we're searching all volumes
						(itemVolume != currentIssue[0] || // and the volume's changed
							(itemNumber != 0 && itemNumber != currentIssue[1] ))) { // or the number (if there is one)
					html += '<div class="newVol">Vol&nbsp;' + itemVolume;
					currentIssue[0] = itemVolume;
					if (itemNumber != 0 && num != currentIssue[1]) {
						html += ' no. ' + itemNumber;
						currentIssue[1] = itemNumber;
					}
					html += '</div>';
				}
				
				var itemURL = bibdataToURL(bibdata);

				var itemAuthor = latexToUnicode(bibdata.author);
				var ra = RegExp(author, 'gi');
				if (required(author)) itemAuthor = itemAuthor.replace(ra, '<span class="hit">$&</span>');
				
				html += '<li></a><a class="popbutton" href="#popup' + popup +'">Cite</a>';
				html += '<span class="authors">' + formatAuthorList(itemAuthor) + '</span>\n';
				
				html += '<a href="' + itemURL + '" class="pdflink">';							
				var itemTitle = latexToUnicode(bibdata.title);
				var rt = RegExp(title, 'gi');
				if (required(title)) itemTitle = bibdata['title'].replace(rt, '<span class="hit">$&</span>');
				html += '<span class="title">' + itemTitle + '</span></a>';
	
				popup_html +=
				  '<div id="popup' + popup + '" class="overlay">\
		           <div class="popup">\
			          <h2>BiBTeX Citation</h2>\
			          <a class="close" href="#">&times;</a>\
			          <div class="content">\
			          <p>Copy the bibtex entry below:</p>\
			          <pre>' + bibitemToCitation(bibitem, volChoices, itemURL) + '</pre>\
				       </div>\
	              </div>\
	            </div>';
	            
	         popup++;
         }
		}
	});

	html += '\n</ul>\n';
	html += popup_html;

	return html;
}

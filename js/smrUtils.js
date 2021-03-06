
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
	var path = docBase + '/' + bibdata.volume;
	if (typeof(bibdata.number) !== 'undefined')
		path += '.' + bibdata.number;
	var authors = bibdata['author'].split(/\s+and\s+/);
	var surnames = [];
	authors.forEach(function (author) {
		surnames.push(author.replace(/,.*/g, '').replace(/\s+/g,' '));
	});
	var file = surnames.join(', ') + ': ' +
		bibdata['title'].replace(/\s+/g,' ').replace(/\//g,'-') +
		'.pdf';
	return path + '/' + encodeURIComponent(file);
}

// Convert a bibitem to a BibTeX Citation
function bibitemToCitation(item, volChoices, url) {
        if (url === undefined) url = null;
	item.entryTags['journal'] = journalTitle;
	var number = typeof(item.entryTags['number']) == 'undefined' ?
	               null :
	               item.entryTags['number'];
	item.entryTags['year'] = yearFromVolume(volChoices,
	                                        item.entryTags['volume'],
	                                        number);
	if (url !== null) // Fix relative URLs
		item.entryTags['url'] = url.replace(/^\.\//,
		                                    window.location.href.replace(/[^/]*$/, ''));
	console.log(item.entryTags['url']);
	return bibtexParse.toBibtex([item], false);
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
function yearFromVolume(volChoices, vol, num) {
        if (num === undefined) num = null;
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
				
				html += '<a href="' + itemURL + '" class="pdflink" target="SMR">';							
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

// IE 11: doesn't have the findIndex method. This can be safely deleted when IE finally dies.
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

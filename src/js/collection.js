// Copyright (c) 2012 Kiran Kumar. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/**
 **  This part hooks to google drive and makes the magic happen
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
var DOCLIST_SCOPE = 'https://docs.google.com/feeds';
var DOCLIST_FEED = DOCLIST_SCOPE + '/default/private/full/';

if (localStorage['collection_id'] == undefined)
	localStorage['collection_id'] = '';
var collectionName = 'snipped_from_chrome';

/**
 **  Check if the collection "snipped_from_chrome" exists in google docs
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function checkCollectionExists() {
    if( localStorage['collection_id'] == '') {
	request = {
	    'method' : 'GET',
	    'URI' : DOCLIST_FEED+'?showfolders=true&title='+collectionName+'&title-exact=true',
	    'contentType' : 'application/atom+xml',
	    'onReadyHandler' : checkCollectionHandler
	}
	makeRequest(request);
    }
}


/**
 **  Handler for checkCollection
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function checkCollectionHandler(xhr){
    var doc = xhr.responseText;
    var parser = new DOMParser();
    var link = parser.parseFromString(doc, 'text/xml');
    var items = link.documentElement.childNodes;
    if( items.length == 13)
	createCollection();
    else{
	localStorage['collection_id'] = items[13].firstChild.textContent;
    }
    
}

/**
 **  Create the collection "snipped_from_chrome" - a good way to organize the snips
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function createCollection(docId){
    createCollectionHandler
    var atom = createAtom('folder',collectionName);
    request = {
	'method' : 'POST',
	'URI' : DOCLIST_FEED,
	'contentType' : 'application/atom+xml',
	'body' : atom,
	'onReadyHandler' : createCollectionHandler
    }
    makeRequest(request);
}

/**
 **  Handler for CreateCollection
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function createCollectionHandler(xhr){
    localStorage['collection_id'] = xhr.getResponseHeader('location');
}


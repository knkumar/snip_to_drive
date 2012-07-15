/**
 **  This part hooks to google drive and makes the magic happen
 **  publish date: 06/17/2012
 **  Version: 0.0.1
 **/
var DOCLIST_SCOPE = 'https://docs.google.com/feeds';
var DOCLIST_FEED = DOCLIST_SCOPE + '/default/private/full/';

if (localStorage['collection_id'] == undefined)
	localStorage['collection_id'] = '';
var collectionName = 'snipped_from_chrome';


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

function createCollectionHandler(xhr){
    localStorage['collection_id'] = xhr.getResponseHeader('location');
}


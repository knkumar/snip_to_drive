if(localStorage['createResumableLink'] == undefined)
	localStorage['createResumableLink'] = '';
var doc_uri = '';


function fetchResumableLink() {
    if(localStorage['createResumableLink'])
		createDoc($('#docs-title').val(),localStorage['createResumableLink']);
    else{
	request = {
	    'method' : 'GET',
	    'URI' : DOCLIST_FEED,
	    'contentType' : 'application/json',
	    'onReadyHandler' : fetchResumableHandler
	}
	makeRequest(request);
    }
}

function fetchResumableHandler(xhr) {
    // Great success: parse response with XML
    var doc = xhr.responseText;
    var parser = new DOMParser();
    var link = parser.parseFromString(doc, 'text/xml');
    var items = link.documentElement.childNodes;
    for (var index=0;index <items.length; index++) {
	if(items[index].nodeName == 'link'){
	    for(var attrIndex=0; attrIndex < items[index].attributes.length; attrIndex++) {
		if (items[index].attributes[attrIndex].nodeName == 'rel') {
		    var val = items[index].attributes[attrIndex].nodeValue;
		    if (val.search("#resumable-create-media") != -1) {
			//do something awesome
			localStorage['createResumableLink'] = items[index].attributes[attrIndex+2].nodeValue;
			//callback(text, URI);
			createDoc($('#docs-title').val(), localStorage['createResumableLink']);
			return;
		    }
		}
	    }
	}
    }
    
}

function createDoc(titleDoc, URI) {
    /*
      The data dance consists of 3 steps
      1. Fetch the resumable url - google says don't hardcode this
      2. send the post with the title
      3. send the content in chunks, ideally we send all in one chunk
     */
    var body = createAtom('document',titleDoc);
    request = {
	'method' : 'POST',
	'URI' : URI,
	'contentType' : 'application/atom+xml',
	'body' : body,
	'onReadyHandler' : createHandler
    }
    makeRequest(request);
}

function createHandler(xhr) {
    // Great success: get location from header for content upload
    var doc = xhr.getResponseHeader('location');
    //send a put request
    request = {
	'method' : 'PUT',
	'URI' : doc,
	'body' : $('#selected').html(),
	'contentType' : 'text/html',
	'onReadyHandler' : putHandler 
    }
    makeRequest(request);
}
    
function putHandler(xhr) {
    /*
	  1. check if collection exists
      2. else create collection
      3. move to collection
	*/
    var items = xhr.responseXML.firstChild.childNodes;
    doc_uri = items[0].firstChild.data;
    addDocCollection();
}

function addDocCollectionHandler(xhr){
    $('#snip-drive-id').attr('style','display:none');
    $('#selected').attr('style','display:none');
    $('#success').attr('style','display:block');
}

function addDocCollection(){
    if( doc_uri != '' && localStorage['collection_id'] != '') {
	var atom = ["<?xml version='1.0' encoding='UTF-8'?>", 
		    '<entry xmlns="http://www.w3.org/2005/Atom">',
		    '<id>'+doc_uri+'</id>',
		    '</entry>'].join('');
	var request = {
	    'method' : 'POST',
	    'URI' : localStorage['collection_id'].replace('/id/','/default/private/full/')+'/contents',
	    'contentType' : 'application/atom+xml',
	    'body' : atom,
	    'onReadyHandler' : addDocCollectionHandler
	}
	makeRequest(request);
    }
    else
	setTimeout(addDocCollection,5000);
}

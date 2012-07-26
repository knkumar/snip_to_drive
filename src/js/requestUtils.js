// Copyright (c) 2012 Kiran Kumar. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 **  The makeRequest wrapper takes a request object which has 
 **  Content-Type, method, body, and onReadyHandler and issues 
 **  a xmlHttpRequest to the URI
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function makeRequest(request) {
    // Make an XHR that creates the task
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
	    if(xhr.status == 200 || event.target.status == 201) {
		request['onReadyHandler'](xhr);
	    }
	    else{
		// Request failure: something bad happened
		console.log(xhr.status);
		console.log(xhr.responseText);
	    }
	}
    };
    // may cause blocking operation - need to verify
    xhr.open(request['method'], request['URI'], true);
    xhr.setRequestHeader('Content-type', request['contentType']);
    xhr.setRequestHeader('GData-Version', '3.0');
    xhr.setRequestHeader('Authorization', 'OAuth ' + google.getAccessToken());
    if (request['method'] == 'PUT'){
	xhr.send(request['body'])
    }
    else if(request['body']) {
	xhr.setRequestHeader('X-Upload-Content-Type', 'text/html');
	xhr.setRequestHeader('X-Upload-Content-Length', $('#selected').html().length);
	xhr.send(request['body']);
    }
    else
	xhr.send();
}


/**
 **  Displays an error if the request failed from the handler function
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/    
function dispError() {
    $('#snip-drive-id').attr('style','display:none');
    $('#selected').attr('style','display:none');
    $('#failure').attr('style','display:block');    
}

/**
 **  Create the body for request from the atom and the content under "#snip-content"
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function createBody (atom){
    var body = ['--END_OF_PART\r\n',
		'Content-Type: application/atom+xml;\r\n\r\n',
		atom, '\r\n',
		'--END_OF_PART\r\n',
		'X-Upload-Content-Type: ', 'text/html', '\r\n\r\n',
		$('#snip-content').html(), '\r\n',
		'--END_OF_PART--\r\n'].join('');
}

/**
 **  Create the atom xml element to transmit from the category and title
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function createAtom (category, titleDoc) {

    var atom = ["<?xml version='1.0' encoding='UTF-8'?>", 
		'<entry xmlns="http://www.w3.org/2005/Atom" xmlns:docs="http://schemas.google.com/docs/2007">',
		'<category scheme="http://schemas.google.com/g/2005#kind"', 
		' term="http://schemas.google.com/docs/2007#'+category+'"/>',
		'<title>', titleDoc, '</title>',
		'</entry>'].join('');
    return atom;
}


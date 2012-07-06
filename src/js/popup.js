// Copyright (c) 2012 Kiran Kumar. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

$(document).ready(getSelection);

google.authorize(checkAuthorized);

/**
 **  The callback for authorize - fetches the resumable media link and checks for the collection "snipped from chrome"
 **  publish date: 07/05/2012
 **  Version: 0.0.2
 **/
function checkAuthorized() {
	// on form submit handler    
    $('#snip-drive-id').on('submit', function(event) {
	event.preventDefault();
	// fetchResumableLink stores the resumable link in doc_uri
	fetchResumableLink();
	// checks if the collection "snipped_from_chrome" exists, if not creates a collection to save all snips
	checkCollectionExists();
    });					  
}


/**
 **  gets the url for page from chrome.tabs.getSelected
 **  called_by: disp_selection
 **  publish date: 07/05/2012
 **  Version: 0.0.2
 **/
function getURL(callback) {
    chrome.tabs.getSelected(null, function(tab) {
	callback(tab.url);
    });
}

/**
 **  Function gets the selected text from chrome.tabs in background.html
 **  called_by: document.ready
 **  publish date: 06/17/2012
 **  Version: 0.0.1
 **/
function getSelection () {
    chrome.tabs.getSelected (null, function(tab) {
	chrome.tabs.sendRequest (tab.id, {method: "getSelection"}, function(response){
	    dispSelection(response.data);
	});
    });
}


/**
 **	 Function creates the child with the selected text in popup.html
 **  called_by: get_selection
 **  publish date: 06/17/2012
 **  Version: 0.0.1
 **/
function dispSelection(text) {
    var div = document.createElement('div');
    div.setAttribute('class', 'selected');
    div.setAttribute('id', 'selected');
    div.setAttribute('style','display:block');
    div.innerHTML = text;
    var p = document.createElement('p');
    p.setAttribute('id','snip-content');
    //div.appendChild(txt);
    var a = document.createElement('a');
    a.title = "URL";
    getURL(function (URL) {
	a.innerHTML = URL;
	a.href = URL;
    });    
    p.appendChild(a)
    div.insertBefore(p, div.firstChild);
    document.body.appendChild(div);
}

function format_links(text) {

}
// Copyright (c) 2012 Kiran Kumar. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


$(document).ready(getSelection);
google.authorize(checkAuthorized);

/**
 **  The callback for authorize - fetches the resumable media link and checks for the collection "snipped from chrome"
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
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
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function getURL(callback) {
    chrome.tabs.getSelected(null, function(tab) {
	callback(tab.url);
    });
}

/**
 **  Function creates the child with the selected text in popup.html
 **  called_by: get_selection
 **  publish date: 06/17/2012
 **  Version: 0.0.1
 **/
function dispSelection(text, title) {
    var div = document.createElement('div');
    div.setAttribute('class', 'selected');
    div.setAttribute('id', 'selected');
    div.setAttribute('style','display:block;font-size:0.8em;');
    div.innerHTML = text; 
    var p = document.createElement('p');
    p.setAttribute('id','snip-content');
    p = setStyleUrl(p);
    div.insertBefore(p, div.firstChild);
    $('.comment').before(div);
    $('#docs-title').val(title);
    getURL( function(URL) 
	    {
		format_links(URL);
	    });    


}

/**
 **  Function sets the style lements for the url and content
 **  called_by: dispSelection
 **  publish date: 06/17/2012
 **  Version: 2012.07.22
 **/
function setStyleUrl(element){
    element.style.backgroundColor = "gainsboro";
    element.style.padding = "10px";
    var a = document.createElement('a');
    a.setAttribute('class', 'url');
    a.title = "URL";
    getURL(function (URL) {
	a.innerHTML = URL;
	a.href = URL;
    });    
    element.appendChild(a);
    return element;
}

/**
 **  Function sets the style lements for the url and content
 **  called_by: 
 **  publish date: 07/26/2012
 **  Version: 2012.07.26
 **/

function format_links(url) {
    // get all a elemets and update the href attribute by making it absolute
    console.log("url::"+url);
    $('#selected > a').attr('href', 
	      function(index, href){
		  var uri = new URI(href);
		  return uri.absoluteTo(url); // returns a new URI instance
	      });
    $('#selected > img').attr('src', 
	      function(index, src){
		  var uri = new URI(src);
		  return uri.absoluteTo(url); // returns a new URI instance
	      });

}


/**
 **  Function gets the selected text from chrome.tabs in background.html
 **  called_by: document.ready
 **  publish date: 07/22/2012
 **  Version: 2012.07.22
 **/
function getSelection () {
    chrome.tabs.getSelected (null, function(tab) {
	chrome.tabs.sendRequest (tab.id, {method: "getSelection"}, function(response){
	    console.log(tab.id);
	    console.log(response);
	    dispSelection(response.urlData, tab.title);
	});
    });
}

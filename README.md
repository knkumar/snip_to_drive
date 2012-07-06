#Snip web content to google drive#

This project contains parts to read data from a web page in chrome. The user is authenticated to the google services through OAUTH2. 

The mechanism is to user XMLHttpRequests to GET the required links and create a collection for storing the snips. Then we make a POST using the resumableCreateMediaLink and upload using the PUT request.

Once the document is created it is then moved to "snipped_from_chrome" collection for housekeeping.


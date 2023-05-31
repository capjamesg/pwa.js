const SELECTOR = "#main";

var main_content = document.querySelector(SELECTOR);

function fetchPage(url) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
        var parsed_response = new DOMParser().parseFromString(req.response, 'text/html');

        var new_content = parsed_response.querySelector(SELECTOR);

        main_content.innerHTML = new_content.innerHTML;

        var all_links = main_content.querySelectorAll('a');

        setLinkHandlers(all_links);
    }
  }
  req.open('GET', url);
  req.setRequestHeader('X-Chromeless', 'true');
  req.send();
}

function handleLinkClick(event) {
  event.preventDefault();
  var url = this.href;
  window.history.pushState(null, null, url);
  fetchPage(url);
}

function setLinkHandlers(all_links) {
    for (var i = 0; i < all_links.length; i++) {
        all_links[i].addEventListener('click', handleLinkClick);
    }
}

var all_links = document.querySelectorAll('a');
setLinkHandlers(all_links);
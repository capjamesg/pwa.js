const SELECTOR = "#main";
const RENDER_HEAD = true;

var head = document.querySelector('head');
var main_content = document.querySelector(SELECTOR);

const linkIsExternal = (link) => {
  return link.hostname !== window.location.hostname;
};

const fetchPage = (url) => {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
        var parsed_response = new DOMParser().parseFromString(req.response, 'text/html');

        var new_content = parsed_response.querySelector(SELECTOR);

        main_content.innerHTML = new_content.innerHTML;

        if (RENDER_HEAD) {
          head.innerHTML = parsed_response.querySelector('head').innerHTML;
        }

        var all_links = main_content.querySelectorAll('a');

        setLinkHandlers(all_links);
    }
  }
  req.open('GET', url);
  if (RENDER_HEAD) {
    req.setRequestHeader('X-Headless', 'true');
  }
  req.send();
};

const handleLinkClick = function(event) {
  event.preventDefault();
  var url = this.href;
  window.history.pushState(null, null, url);
  fetchPage(url);
};

const setLinkHandlers = (all_links) => {
    for (var i = 0; i < all_links.length; i++) {
      if (!linkIsExternal(all_links[i])) {
        all_links[i].addEventListener('click', handleLinkClick);
      }
    }
};

const configureLinks = () => {
  var all_links = document.querySelectorAll('a');
  setLinkHandlers(all_links);

  window.addEventListener('popstate', function(event) {
    fetchPage(window.location.href);
  });
};

configureLinks();
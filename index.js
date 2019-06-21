(function() {
  var form = document.querySelector('form');

  form.addEventListener('submit', onFormSubmit);

  function onFormSubmit(event) {
    var captchaEl = form.querySelector('#g-recaptcha-response');
    var emailEl = form.querySelector('#email');

    var captcha = captchaEl && captchaEl.value;
    var email = emailEl && emailEl.value;

    var data = {
      email: email,
      captcha: captcha
    };

    post('/.netlify/functions/to-slack', data, onPost);

    event.preventDefault();
  }

  function onPost(error, data) {
    console.log(error, data);
  }

  function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(null, JSON.parse(xhr.responseText));
        } else {
          callback(xhr.statusText);
        }
      }
    };

    xhr.send(JSON.stringify(data));
  }
})()

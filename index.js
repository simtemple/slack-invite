(function() {
  var form = document.querySelector('form');
  var submitButtonEl = form.querySelector('button');
  var errorOutput = document.querySelector('output');

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
   
    submitButtonEl.setAttribute('disabled', 'disabled');
    submitButtonEl.textContent = 'Joining...';

    post('/.netlify/functions/to-slack', data, onPost);

    event.preventDefault();
  }

  function onPost(data) {
    var succeeded = data.success === true;

    if (succeeded) {
      form.classList.add('success');
    } else {
      form.classList.add('fail');
      errorOutput.textContent = formatTitle(data.message);
    }
  }

  function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState === 4) {
        callback(JSON.parse(xhr.responseText));
      }
    };

    xhr.send(JSON.stringify(data));
  }
})()

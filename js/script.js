'use strict'

document.addEventListener("DOMContentLoaded", function() {
  // Hamburger

  const btnMenu = document.querySelector('.btn_hamburger'),
  header = document.querySelector('.header'),
  menu = header.querySelector('.menu_list');

    function toggleMenu() {
    if (header.classList.contains('show')) {
      header.classList.remove('show');
      btnMenu.classList.remove('open');
    } else {
      header.classList.add('show');
      btnMenu.classList.add('open');
    }
  }

  btnMenu.addEventListener('click', toggleMenu);


  // Scroller

  const scroller = document.getElementById('scroller');

  if (scroller) {
    const scrollContainer = () => {
      return document.documentElement || document.body;
    };
  
    document.addEventListener("scroll", () => {
      if (scrollContainer().scrollTop > 600) {
        scroller.classList.remove("hidden");
        header.classList.add('sticky');
      } else {
        scroller.classList.add("hidden");
        header.classList.remove('sticky')
      }
    });
  
    scroller.addEventListener('click', () => {
      topFunction()
    })
  
    function topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
  }

  // Contact Form

  const form = document.getElementById('contact_form'),
        formElements = document.querySelector('.form_body'),
        textarea = document.querySelector('.form_textarea');

  if (form) {

    // Focus on form elements
    formElements.addEventListener('input', e => {
      const target = e.target;
      if (target && target.matches('.form_input') && target.value === '') {  
        target.classList.remove('focus');
      } else {
        target.classList.add('focus');
      } 
    })

    // Textarea
    textarea.addEventListener('keydown', resize);
    function resize() {
      const el = this;
      setTimeout(function() {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
      }, 1);
    }

    // Submit form
    form.addEventListener('submit', formSend);

    // Send form

    async function formSend(e) {
      e.preventDefault();
      let error = formValidate(form);

      const formData = new FormData(form);

      if (error === 0) {
        form.classList.add('loading');
        const response = await fetch('sendmail.php', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          alert(result);
          form.reset();
          form.classList.remove('loading');
        } else {
          alert('Error');
          form.classList.remove('loading');
        }
      }
    }

    // Form validation
    function formValidate(form) {
      let error = 0;
      let formReq = document.querySelectorAll('.req');
      
      // Validation messages
      const errorMessages = {
        email: 'Please enter a valid email address',
        require: 'This field is required',
        phone: 'Please enter a valid number',
      }
      
      const errors = document.querySelectorAll('.error_message');
      errors.forEach(error => {
        error.remove()
      })
      
      for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];
        // Create error message
        const alert = document.createElement('p');
        alert.classList.add('error_message');
        formRemoveError(input);
        
        if (input.value === '') {
          formAddError(input);
          alert.textContent = errorMessages.require;
          input.after(alert);
          error++;

        } else if (input.classList.contains('email')) {
          if (emailTest(input)) {
            formAddError(input);
            alert.textContent = errorMessages.email;
            input.after(alert);
            error++;
          } 
        } else if (input.classList.contains('phone')) {
          if (phoneTest(input)) {
            formAddError(input);
            alert.textContent = errorMessages.phone;
            input.after(alert);
            error++;
          } 
        }
      }
      return error
    }

    function formAddError(input) {
      input.parentElement.classList.add('error');
      input.classList.add('error');
    }

    function formRemoveError(input) {
      input.parentElement.classList.remove('error');
      input.classList.remove('error');
    }

    // Test Email validation
    function emailTest(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    // Test Phone validation
    function phoneTest(input) {
      return !/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(input.value);
    }

  }

})



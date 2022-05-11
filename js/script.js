"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Hamburger
  const btnMenu = document.querySelector(".btn_hamburger"),
    header = document.querySelector(".header"),
    menu = header.querySelector(".menu_list");

  function toggleMenu() {
    if (header.classList.contains("show")) {
      header.classList.remove("show");
      btnMenu.classList.remove("open");
    } else {
      header.classList.add("show");
      btnMenu.classList.add("open");
    }
  }

  btnMenu.addEventListener("click", toggleMenu);

  // Scroller

  const scroller = document.getElementById("scroller");

  if (scroller) {
    const scrollContainer = () => {
      return document.documentElement || document.body;
    };

    document.addEventListener("scroll", () => {
      if (scrollContainer().scrollTop > 600) {
        scroller.classList.remove("hidden");
      } else if (scrollContainer().scrollTop > 200) {
        header.classList.add("sticky");
      } else {
        scroller.classList.add("hidden");
        header.classList.remove("sticky");
      }
    });

    scroller.addEventListener("click", () => {
      topFunction();
    });

    function topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
  }

  // Faq Accordion

  const faqHeaders = document.querySelectorAll(".faq_header"),
    faqContents = document.querySelectorAll(".faq_content");

  if (faqHeaders) {
    faqHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        let content = header.nextElementSibling;
        const openFAQ = document.querySelector(".faq_header.open");

        if (openFAQ && openFAQ !== header) {
          openFAQ.classList.toggle("open");
        }

        header.classList.toggle("open");

        if (content.style.maxHeight) {
          faqContents.forEach((el) => {
            el.style.maxHeight = null;
          });
        } else {
          faqContents.forEach((el) => {
            el.style.maxHeight = null;
          });
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  }

  // Contact Form

  const form = document.getElementById("contact_form"),
    formElements = document.querySelector(".form_body"),
    textarea = document.querySelector(".form_textarea"),
    popUp = document.querySelector(".contact_pop_up");

  if (form) {
    // Focus on form elements
    formElements.addEventListener("input", (e) => {
      const target = e.target;
      if (target && target.matches(".form_input") && target.value === "") {
        target.classList.remove("focus");
      } else {
        target.classList.add("focus");
      }
    });

    // Textarea
    textarea.addEventListener("keydown", resize);
    function resize() {
      const el = this;
      setTimeout(function () {
        el.style.cssText = "height:auto; padding:0";
        el.style.cssText = "height:" + el.scrollHeight + "px";
      }, 1);
    }

    // Submit form
    form.addEventListener("submit", formSend);

    // Send form

    async function formSend(e) {
      e.preventDefault();
      let error = formValidate(form);

      const formData = new FormData(form);

      if (error === 0) {
        form.classList.add("loading");
        const response = await fetch("sendmail.php", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          alert(result);
          form.reset();
          form.classList.remove("loading");
          popUp.classList.add("send");
        } else {
          alert("Error");
          form.classList.remove("loading");
          popUp.classList.add("send");
        }
      }
    }

    // Pop UP

    popUp.addEventListener("click", (event) => {
      if (
        event.target === popUp ||
        event.target.getAttribute("data-close") == ""
      ) {
        popUp.classList.remove("send");
      }
    });

    // Close with Escape
    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape" && popUp.classList.contains("send")) {
        popUp.classList.remove("send");
      }
    });

    // Form validation
    function formValidate(form) {
      let error = 0;
      let formItems = document.querySelectorAll(".form_input");

      // Validation messages
      const errorMessages = {
        email: "Please enter a valid email address",
        require: "This field is required",
        phone: "Please enter a valid number",
        digits: "It should contain 10 digits",
      };

      const errors = document.querySelectorAll(".error_message");
      errors.forEach((error) => {
        error.remove();
      });

      // Set error status
      for (let i = 0; i < formItems.length; i++) {
        const input = formItems[i];
        /* Create error message*/
        const alert = document.createElement("p");
        alert.classList.add("error_message");
        formRemoveError(input);

        /* Email */
        if (input.classList.contains("email") && input.value) {
          if (emailTest(input)) {
            formAddError(input);
            alert.textContent = errorMessages.email;
            input.after(alert);
            error++;
          }
        } else if (input.classList.contains("phone") && input.value) {
        /* Phone */
          if (phoneTest(input)) {
            formAddError(input);
            alert.textContent = errorMessages.phone;
            input.after(alert);
            error++;
          } else if (input.value.length < 10) {
            formAddError(input);
            alert.textContent = errorMessages.digits;
            input.after(alert);
            error++;
          }
        } else if (input.classList.contains("req")) {
        /* Required fields*/
          if (input.value === "") {
            formAddError(input);
            alert.textContent = errorMessages.require;
            input.after(alert);
            error++;
          }
        }
      }
      return error;
    }

    // Add Error
    function formAddError(input) {
      input.parentElement.classList.add("error");
      input.classList.add("error");
    }

    // Remove Error
    function formRemoveError(input) {
      input.parentElement.classList.remove("error");
      input.classList.remove("error");
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
});

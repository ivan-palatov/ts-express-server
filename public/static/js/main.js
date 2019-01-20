// Handle close button click on auth error notification
$("#delete").on("click", function() {
  $("#error-notification").hide(500, "linear");
});

// Handle validation errors on auth form
if (errors && path == "auth") {
  // Set email value to what its been before
  $("#email").val(form.email);
  // Display errors
  for (const key in errors) {
    $(`#${key}`).addClass("is-danger");
    $(`#${key}`).next().after(`<div class="help is-danger">${errors[key].msg}</div>`);
    // Remove errors on change
    $(`#${key}`).on("change", function() {
      $(`#${key}`).removeClass("is-danger");
      $(`#${key}`).next().next().hide(300, "linear");
    });
  }
}

// Handle validation errors on register form
if (errors && path == "register") {
  // Set values to what they were before the request
  $("#email").val(form.email);
  $("#name").val(form.name);
  // Display errors on form elements
  for (const key in errors) {
    $(`#${key}`).addClass("is-danger");
    $(`#${key}`).next().next().after(`<div class="help is-danger">${errors[key].msg}</div>`);
    // Remove errors on change
    $(`#${key}`).on("change", function() {
      $(`#${key}`).removeClass("is-danger");
      $(`#${key}`).next().next().next().hide(300, "linear");
    });
  }
}
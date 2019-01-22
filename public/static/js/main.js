// Handle close button click on auth error notification
$(".delete").on("click", function() {
  $(".notification").hide(500, "linear");
});

// Handle validation errors on auth form
if (errors && path == "auth") {
  // Set the values to what they were on request
  $("#email").val(form.email);
  // Display errors
  for (const key in errors) {
    $(`#${key}`).addClass("is-danger");
    $(`#${key}`)
      .next()
      .after(`<div class="help is-danger">${errors[key].msg}</div>`);
    // Remove errors on change
    $(`#${key}`).on("change", function() {
      $(`#${key}`).removeClass("is-danger");
      $(`#${key}`)
        .next()
        .next()
        .hide(300, "linear");
    });
  }
}

// Handle validation errors on register form
if (errors && path == "register") {
  // Set the values to what they were on request
  $("#email").val(form.email);
  $("#name").val(form.name);
  // Display errors on form elements
  for (const key in errors) {
    $(`#${key}`).addClass("is-danger");
    $(`#${key}`)
      .next()
      .next()
      .after(`<div class="help is-danger">${errors[key].msg}</div>`);
    // Remove errors on change
    $(`#${key}`).on("change", function() {
      $(`#${key}`).removeClass("is-danger");
      $(`#${key}`)
        .next()
        .next()
        .next()
        .hide(300, "linear");
    });
  }
}

// Handle validation errors on forgot password form
if (errors && path == "forgot-password") {
  // Display errors on form elements
  $("#email").addClass("is-danger");
  $(".help.is-info").after(`<div class="help is-danger">${errors.email.msg}</div>`);
  // Remove errors on change
  $("#email").on("change", function() {
    $("#email").removeClass("is-danger");
    $(".help.is-danger").hide(300, "linear");
  });
}

// Handle validation errors on reset password
if (errors && path == "reset-password") {
  // Display errors on form elements
  for (const key in errors) {
    $(`#${key}`).addClass("is-danger");
    $(`#${key}`)
      .next()
      .next()
      .after(`<div class="help is-danger">${errors[key].msg}</div>`);
    // Remove errors on change
    $(`#${key}`).on("change", function() {
      $(`#${key}`).removeClass("is-danger");
      $(`#${key}`)
        .next()
        .next()
        .next()
        .hide(300, "linear");
    });
  }
}

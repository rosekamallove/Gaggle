$("#postTextarea").keyup((event) => {
  const textbox = $(event.target);
  const value = textbox.val().trim();
  console.log(value);

  const submitButton = $("#submitPostButton");
  if (submitButton.length == 0) return console.error("No submit Button found");

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

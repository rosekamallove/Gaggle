$("#postTextarea").keyup((event) => {
  const textbox = $(event.target);
  const value = textbox.val().trim();

  const submitButton = $("#submitPostButton");
  if (submitButton.length == 0) return console.error("No submit Button found");

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

$("#submitPostButton").click(() => {
  const button = $(event.target);
  const textBox = $("#postTextarea");

  const data = {
    content: textBox.val(),
  };

  $.post("api/posts", data, (postData, status, xhr) => {
    console.log(postData);
  });
});

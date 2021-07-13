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
    const html = createPostHTML(postData);
    $(".postBodyContainer").prepend(html);
    textBox.val("");
    button.prop("disabled", true);
  });
});

function createPostHTML(postData) {
  return `
    <div class="post">
      <div class="mainContentContainer">
        <div class="userImageConainer">
          <img src="${postData.postedBy.profilePic}">
        </div>
        <div class="postCotnentContainer">
          <div class="postHeader"></div>
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter"></div>
        </div>
      </div>
    </div>
  `;
}

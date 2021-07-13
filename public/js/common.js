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
    console.log(postData.postedBy);
    const html = createPostHTML(postData);
    $(".postBodyContainer").prepend(html);
    textBox.val("");
    button.prop("disabled", true);
  });
});

function createPostHTML(postData) {
  const postedBy = postData.postedBy;
  if (postedBy._id === undefined) return console.log("userObject no Populated");

  const displayName = `${postData.postedBy.firstName} ${postData.postedBy.lastName}`;
  /* Damn I need a better way to do this */
  return `
    <div class="post">
      <div class="mainContentContainer">
        <div class="userImageContainer">
          <img src="${postData.postedBy.profilePic}">
        </div>
        <div class="postContentContainer">
          <div class="postHeader">
            <a class="displayName" href='/profile/${postData.postedBy.username}'>${displayName}</a>
            <a class="username" href='/profile/${postData.postedBy.username}'>@${postData.postedBy.username}</a>
            <span class='date'>${postData.createdAt}</span>
          </div>
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button class="comment">
                <i class="far fa-comment"></i>
              </button>
            </div>
            <div class="postButtonContainer">
              <button class="retweet">
                <i class="fas fa-retweet"></i>
              </button>
            </div>
            <div class="postButtonContainer">
              <button class="love">
                <i class="far fa-heart"></i>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

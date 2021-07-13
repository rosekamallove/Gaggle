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
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
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
            <span class='date'>${timestamp}</span>
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

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just Now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour)
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

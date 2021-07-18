/**********************************
 *  Handles @submit_button_state  *
 **********************************/
$("#postTextarea, #replyTextarea").keyup((event) => {
  const textbox = $(event.target);
  const value = textbox.val().trim();

  /* Checking for if Modal or Post */
  const isModal = textbox.parents(".modal").length == 1;

  const submitButton = isModal
    ? $("#submitReplyButton")
    : $("#submitPostButton");

  if (submitButton.length == 0) return console.error("No submit Button found");

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

/**********************************
 *  Handles @reply Show On Modal  *
 **********************************/
$("#replyModal").on("show.bs.modal", (event) => {
  const button = $(event.relatedTarget);
  const postId = getPostIdByFromElement(button);

  $.get(`/api/posts/${postId}`, (posts) => {
    console.log(posts);
  });
});

/**********************************
 *    Handles @Creation of Post    *
 **********************************/
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
/**********************************
 *  Handles @Likes for Each Post   *
 **********************************/
$(document).on("click", ".likeButton", () => {
  const button = $(event.target);
  const postId = getPostIdByFromElement(button);
  if (postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "");

      /* State of Like Button */
      if (postData.likes.includes(userLoggedin._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});

/**********************************
 * Handles @Retweet for Each Post  *
 **********************************/
$(document).on("click", ".retweetButton", () => {
  const button = $(event.target);
  const postId = getPostIdByFromElement(button);
  if (postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      button.find("span").text(postData.retweetUsers.length || "");

      if (postData.retweetUsers.includes(userLoggedin._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});

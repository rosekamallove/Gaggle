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

  $("#submitReplyButton").data("id", postId);

  $.get(`/api/posts/${postId}`, (posts) => {
    outputPosts(posts, $("#originalPostContainer"));
  });
});
/* Clearing the html after Unmount */
$("#replyModal").on("hidden.bs.modal", () =>
  $("#originalPostContainer").html("")
);
/**********************************
 *Handles @Creation of Post and Reply*
 **********************************/
$("#submitPostButton, #submitReplyButton").click(() => {
  const button = $(event.target);

  /* Checking for if Modal or Post */
  const isModal = button.parents(".modal").length == 1;
  const textBox = isModal ? $("#replyTextarea") : $("#postTextarea");

  var data = {
    content: textBox.val(),
  };

  if (isModal) {
    const id = button.data().id;
    if (id == null) alert("Button id is null");
    data.replyTo = id;
  }

  $.post("api/posts", data, (postData, status, xhr) => {
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

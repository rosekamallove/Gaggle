/**********************
 *  @Utiliy Functions  *
 *********************/

/* Returns the Html for Posts */
function outputPosts(posts, container) {
  container.html("");
  if (posts.length == 0) container.append("<span> No results found </span>");

  if (!Array.isArray(posts)) {
    posts = [posts];
  }

  posts.forEach((post) => {
    const html = createPostHTML(post);
    container.append(html);
  });
}

/* Returns the Markup for a Post */
function createPostHTML(postData) {
  if (postData == null) return alert("postObject Null");

  const isRetweet = postData.retweetData !== undefined;
  const retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  /* if PostedBy is undefined */
  const postedBy = postData.postedBy;
  if (postedBy._id === undefined) return console.log("userObject no Populated");

  /* Display variable */
  const displayName = `${postData.postedBy.firstName} ${postData.postedBy.lastName}`;
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  /* Button state on page load */
  const likeButtonActiveClass = postData.likes.includes(userLoggedin._id)
    ? "active"
    : "";
  const retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedin._id
  )
    ? "active"
    : "";

  /* Retweet Display Text */
  var retweetText = "";
  if (isRetweet) {
    retweetText = `
    <span>
      <i class="fas fa-retweet"></i>
      Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a>
    </span>`;
  }

  /* Damn I need a better way to do this */
  return `
  <div class="postActionContainer">${retweetText}</div>
    <div class="post" data-id="${postData._id}">
      <div class="mainContentContainer">
        <div class="userImageContainer">
          <img src="${postData.postedBy.profilePic}">
        </div>
        <div class="postContentContainer">
          <div class="postHeader">

            <a class="displayName" href='/profile/${
              postData.postedBy.username
            }'>${displayName}</a>

            <a class="username" href='/profile/${
              postData.postedBy.username
            }'>@${postData.postedBy.username}</a>

            <span class='date'>${timestamp}</span>
          </div>
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button class="commentButton" data-toggle="modal" data-target="#replyModal">
                <i class="far fa-comment"></i>
              </button>
            </div>
            <div class="postButtonContainer">
              <button class="retweetButton ${retweetButtonActiveClass}">
                <i class="fas fa-retweet"></i>
                <span>${postData.retweetUsers.length || ""}</span>
              </button>
            </div>
            <div class="postButtonContainer">
              <button class="likeButton ${likeButtonActiveClass}">
                <i class="far fa-heart"></i>
                <span>${postData.likes.length || ""}</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* Returns the Root element with PostID */
function getPostIdByFromElement(element) {
  const isRoot = element.hasClass("post");
  const rootElement = isRoot ? element : element.closest(".post");
  const postId = rootElement.data().id;
  if (postId === undefined) return alert("Post Id Undefined");
  return postId;
}

/* Date() -> timestamp + timestamp ago */
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

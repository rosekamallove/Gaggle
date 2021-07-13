$(document).ready(() => {
  $.get("api/posts", (posts, status, xhr) => {
    outputPosts(posts, $(".postBodyContainer"));
  });
});

function outputPosts(posts, container) {
  container.html("");
  if (posts.length == 0) container.append("<span> No results found </span>");

  posts.forEach((post) => {
    const html = createPostHTML(post);
    container.append(html);
  });
}

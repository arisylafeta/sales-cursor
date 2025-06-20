/**
 * Unipile API - LinkedIn Posts Response Cleaners
 * 
 * This file contains functions for cleaning and formatting LinkedIn post responses
 * from the Unipile API to make them suitable for feeding to an LLM.
 */

/**
 * Clean and format a single post
 * 
 * @param post - The raw post data from the API
 * @returns A cleaned and formatted post
 */
function cleanPost(post: any): any {
  if (!post) return null;

  return {
    id: post.id,
    text: post.text,
    date: post.date,
    parsedDateTime: post.parsed_datetime,
    shareUrl: post.share_url,
    stats: {
      comments: post.comment_counter,
      reactions: post.reaction_counter,
      reposts: post.repost_counter,
      impressions: post.impressions_counter
    },
    author: post.author ? {
      name: post.author.name,
      headline: post.author.headline,
      publicIdentifier: post.author.public_identifier,
      isCompany: post.author.is_company
    } : null,
    attachments: post.attachments ? post.attachments.map((attachment: any) => ({
      type: attachment.type,
      url: attachment.url,
      ...(attachment.type === 'file' ? { fileName: attachment.file_name, mimeType: attachment.mimetype } : {}),
      ...(attachment.type === 'img' || attachment.type === 'video' ? { 
        width: attachment.size?.width,
        height: attachment.size?.height
      } : {})
    })) : [],
    isRepost: post.is_repost
  };
}

/**
 * Clean and format user posts response
 * 
 * @param postsResponse - The raw user posts response from the API
 * @returns Cleaned and formatted user posts
 */
export function cleanUserPosts(postsResponse: any): any {
  if (!postsResponse || !postsResponse.items) return { posts: [] };

  return {
    posts: postsResponse.items.map(cleanPost)
  };
}

/**
 * Clean and format post comments response
 * 
 * @param commentsResponse - The raw post comments response from the API
 * @returns Cleaned and formatted post comments
 */
export function cleanPostComments(commentsResponse: any): any {
  if (!commentsResponse || !commentsResponse.items) return { comments: [] };

  return {
    comments: commentsResponse.items.map((comment: any) => ({
      id: comment.id,
      text: comment.text,
      date: comment.date,
      parsedDateTime: comment.parsed_datetime,
      author: comment.author ? {
        name: comment.author.name,
        headline: comment.author.headline,
        publicIdentifier: comment.author.public_identifier,
        isCompany: comment.author.is_company
      } : null,
      stats: {
        reactions: comment.reaction_counter || 0
      }
    }))
  };
}

/**
 * Clean and format create post response
 * 
 * @param createPostResponse - The raw create post response from the API
 * @returns Cleaned and formatted create post response
 */
export function cleanCreatePostResponse(createPostResponse: any): any {
  if (!createPostResponse) return null;

  return {
    success: true,
    postId: createPostResponse.post_id,
    object: createPostResponse.object
  };
}

/**
 * Clean and format comment on post response
 * 
 * @param commentResponse - The raw comment on post response from the API
 * @returns Cleaned and formatted comment on post response
 */
export function cleanCommentOnPostResponse(commentResponse: any): any {
  if (!commentResponse) return null;

  return {
    success: true,
    object: commentResponse.object
  };
}
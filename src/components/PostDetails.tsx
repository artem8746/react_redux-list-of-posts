import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { CommentInfo } from './CommentInfo';
import { CommentData } from '../types/Comment';
import { CommentErrors } from '../types/CommentErrors';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  addComment,
  loadComments,
  setComments,
} from '../features/commentsSlice';

interface Props {
  post: Post,
}

export const PostDetails: React.FC<Props> = ({ post }) => {
  const { id, title, body } = post;
  const dispatch = useAppDispatch();
  const {
    comments,
    isLoading,
    errorMessage,
  } = useAppSelector(state => state.comments);

  const [isFormOpened, setIsFormOpened] = useState(false);

  useEffect(() => {
    dispatch(loadComments(id));

    return () => {
      dispatch(setComments([]));
      setIsFormOpened(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddNewComment = (commentData: CommentData) => {
    return dispatch(addComment({
      ...commentData,
      postId: id,
    }));
  };

  const isNewCommentButtonShown = !errorMessage
    && !isFormOpened;
  const isNoCommentMessageShown = !errorMessage
    && !comments.length;
  const areCommentsShown = errorMessage !== CommentErrors.UnableToLoadComments
    && !!comments.length;

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${id}: ${title}`}
          </h2>

          <p data-cy="PostBody">
            {body}
          </p>
        </div>

        <div className="block">
          {isLoading
            ? <Loader />
            : (
              <>
                {!!errorMessage && (
                  <div
                    className="notification is-danger"
                    data-cy="CommentsError"
                  >
                    {errorMessage}
                  </div>
                )}

                {areCommentsShown
                  && (
                    <>
                      <p className="title is-4">Comments:</p>

                      {comments.map(comment => (
                        <CommentInfo key={comment.id} comment={comment} />
                      ))}
                    </>
                  )}

                {isNoCommentMessageShown
                  && (
                    <p className="title is-4" data-cy="NoCommentsMessage">
                      No comments yet
                    </p>
                  )}

                {isNewCommentButtonShown
                  && (
                    <button
                      data-cy="WriteCommentButton"
                      type="button"
                      className="button is-link"
                      onClick={() => setIsFormOpened(true)}
                    >
                      Write a comment
                    </button>
                  )}
              </>
            )}
        </div>

        {isFormOpened && (
          <NewCommentForm handleAddNewComment={handleAddNewComment} />
        )}
      </div>
    </div>
  );
};

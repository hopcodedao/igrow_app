// src/pages/PostDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { usePostAndComments } from '../hooks';
import { PageNotFound } from './';
import { CommentForm } from '../components';

function PostDetail() {
  const { courseId, postId } = useParams();
  const { loading, error, post, comments } = usePostAndComments(courseId, postId);

  if (loading) return <p className="page-heading">Đang tải bài viết...</p>;
  if (error || !post) return <PageNotFound />;

  return (
    <div className="mx-auto mb-32 w-[90%] max-w-4xl animate-reveal">
      <div className="mb-8">
        <Link to={`/course/${courseId}/forum`} className="link-text">
          &larr; Quay lại diễn đàn
        </Link>
      </div>

      {/* Nội dung bài viết */}
      <div className="card p-6">
        <div className="flex items-center gap-4 border-b pb-4 dark:border-gray-700">
          <img src={post.authorAvatar || `https://i.pravatar.cc/150?u=${post.authorId}`} alt={post.authorName} className="h-14 w-14 rounded-full" />
          <div>
            <p className="font-bold">{post.authorName}</p>
            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="prose prose-lg dark:prose-invert mt-6 max-w-none">
            <h1 className='text-black dark:text-white'>{post.title}</h1>
            <p>{post.content}</p>
        </div>
      </div>

      {/* Khu vực bình luận */}
      <div className="card mt-8 p-6">
        <h2 className="text-2xl font-bold">{comments.length} Bình luận</h2>
        <CommentForm courseId={courseId} postId={postId} />

        <div className="mt-6 space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <img src={comment.authorAvatar || `https://i.pravatar.cc/150?u=${comment.authorId}`} alt={comment.authorName} className="h-12 w-12 rounded-full" />
              <div className="flex-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <p>
                  <strong className="font-semibold">{comment.authorName}</strong>
                  <span className="ml-2 text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                </p>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
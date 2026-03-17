import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Trash2, Reply, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import socket from '../../utils/socket';

const EventComments = ({ eventId, user }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/${eventId}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchComments();

    // Socket.io for live comments
    socket.on('comment:new', (newComment) => {
      if (newComment.event === eventId) {
        setComments(prev => [newComment, ...prev]);
      }
    });

    socket.on('comment:deleted', (commentId) => {
      setComments(prev => prev.filter(c => c._id !== commentId));
    });

    return () => {
      socket.off('comment:new');
      socket.off('comment:deleted');
    };
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    setLoading(true);
    try {
      const { data } = await api.post('comments', {
        eventId,
        text,
        parentId: replyTo?._id || null
      });
      // socket.on will handle adding it to the list if we want, 
      // but let's clear input and reply state
      setText('');
      setReplyTo(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" /></div>;
  }

  // Organize nested comments
  const mainComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        Discussion ({comments.length})
      </h3>

      {/* Comment Box */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="flex items-center justify-between bg-indigo-50 px-4 py-2 rounded-t-xl border-x border-t border-indigo-100">
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                <Reply className="w-3.5 h-3.5" /> Replying to {replyTo.user.name}
              </span>
              <button type="button" onClick={() => setReplyTo(null)} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                <Star className="w-3.5 h-3.5 rotate-45" /> {/* Using Star as X for simplicity or X if available */}
              </button>
            </div>
          )}
          <div className={`relative ${replyTo ? 'rounded-b-xl border-x border-b' : 'rounded-xl border'} border-[var(--color-border)] bg-[var(--color-surface-secondary)] group focus-within:border-indigo-500 transition-all`}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
              className="w-full bg-transparent px-4 py-3 text-sm font-medium outline-none resize-none min-h-[100px]"
            />
            <div className="flex justify-end p-2">
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {replyTo ? 'Post Reply' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-white border border-dashed border-[var(--color-border)] rounded-2xl text-center">
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">Please log in to join the discussion.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {mainComments.length === 0 ? (
          <p className="text-sm text-[var(--color-text-tertiary)] text-center py-8">No comments yet. Be the first to start the conversation!</p>
        ) : (
          mainComments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={getReplies(comment._id)}
              currentUser={user}
              onReply={setReplyTo}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, replies, currentUser, onReply, onDelete }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="flex gap-4 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-[var(--color-text-primary)]">{comment.user.name}</span>
            <span className="text-[11px] font-medium text-[var(--color-text-tertiary)]">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">{comment.text}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onReply(comment)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
            {currentUser && currentUser._id === comment.user._id && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            )}
          </div>

          {/* Render Replies */}
          {replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-indigo-50 space-y-4">
              {replies.map(reply => (
                <div key={reply._id} className="flex gap-3 group/reply">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px] shrink-0">
                    {reply.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">{reply.user.name}</span>
                      <span className="text-[10px] font-medium text-[var(--color-text-tertiary)]">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{reply.text}</p>
                    {currentUser && currentUser._id === reply.user._id && (
                      <button
                        onClick={() => onDelete(reply._id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 mt-1 flex items-center gap-1 transition-colors opacity-0 group-reply-hover:opacity-100"
                      >
                        <Trash2 className="w-2.5 h-2.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventComments;

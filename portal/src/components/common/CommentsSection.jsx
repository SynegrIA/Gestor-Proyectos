import { useState } from 'react'
import { FiMessageCircle, FiSend, FiClock } from 'react-icons/fi'

export default function CommentsSection({ comments: initialComments = [], onAddComment }) {
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState(initialComments)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const comment = {
            id: Date.now(),
            author: 'Tú',
            text: newComment,
            date: 'Ahora mismo',
            avatar: '👤'
        }

        setComments([...comments, comment])
        setNewComment('')
        if (onAddComment) onAddComment(comment)
    }

    return (
        <div className="comments-section" style={{ minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', color: 'var(--text-muted)' }}>
                <FiMessageCircle />
                <h4 style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Hilo de comentarios</h4>
            </div>

            <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {comments.length === 0 ? (
                    <div className="text-sm text-muted" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                        No hay comentarios todavía. ¡Sé el primero en decir algo!
                    </div>
                ) : (
                    comments.map(c => (
                        <div key={c.id} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <div style={{
                                width: '32px', height: '32px',
                                background: 'var(--gray-100)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px'
                            }}>
                                {c.avatar}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>{c.author}</span>
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiClock size={10} /> {c.date}
                                    </span>
                                </div>
                                <div style={{
                                    background: 'var(--gray-50)',
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: '1.5'
                                }}>
                                    {c.text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                    className="form-input form-input--sm"
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button className="btn btn--primary btn--sm btn--icon">
                    <FiSend />
                </button>
            </form>
        </div>
    )
}

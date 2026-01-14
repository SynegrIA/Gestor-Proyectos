import { useState, useRef, useEffect } from 'react'
import { FiMessageSquare, FiX, FiSend, FiUser } from 'react-icons/fi'

export default function ChatWidget({ userRole }) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([
        { id: 1, role: 'consultor', text: 'Hola, ¿cómo va todo con la recopilación de datos?', time: '10:30' },
        { id: 2, role: 'cliente', text: 'Estamos en ello, casi terminamos con el export de CRM.', time: '10:45' }
    ])
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSend = (e) => {
        e.preventDefault()
        if (!message.trim()) return

        const newMessage = {
            id: Date.now(),
            role: userRole,
            text: message,
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }

        setMessages([...messages, newMessage])
        setMessage('')
    }

    return (
        <div className="chat-widget-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
            {/* Bubble Button */}
            {!isOpen && (
                <button
                    className="chat-bubble"
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px',
                        borderRadius: '50%',
                        background: 'var(--primary-600)',
                        color: 'white',
                        border: 'none',
                        boxShadow: 'var(--shadow-lg)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px',
                        transition: 'transform 0.2s ease-out'
                    }}
                >
                    <FiMessageSquare />
                    <span style={{
                        position: 'absolute', top: '0', right: '0',
                        background: 'var(--danger-500)',
                        width: '12px', height: '12px',
                        borderRadius: '50%', border: '2px solid white'
                    }}></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window card" style={{
                    width: '350px',
                    height: '450px',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: 'var(--shadow-2xl)',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <div className="chat-header" style={{
                        padding: 'var(--space-4)',
                        background: 'var(--primary-600)',
                        color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <FiMessageSquare />
                            <span style={{ fontWeight: 'var(--font-bold)' }}>Chat con {userRole === 'cliente' ? 'Consultor' : 'Cliente'}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="messages-area" ref={scrollRef} style={{
                        flex: 1,
                        padding: 'var(--space-4)',
                        overflowY: 'auto',
                        background: '#f8fafc',
                        display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'
                    }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                alignSelf: msg.role === userRole ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: msg.role === userRole ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: 'var(--text-sm)',
                                    background: msg.role === userRole ? 'var(--primary-600)' : 'white',
                                    color: msg.role === userRole ? 'white' : 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-sm)',
                                    border: msg.role === userRole ? 'none' : '1px solid var(--border-color)',
                                    borderBottomRightRadius: msg.role === userRole ? '2px' : 'var(--radius-lg)',
                                    borderBottomLeftRadius: msg.role === userRole ? 'var(--radius-lg)' : '2px'
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{msg.time}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} style={{
                        padding: 'var(--space-3)',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex', gap: 'var(--space-2)',
                        background: 'white'
                    }}>
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="form-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
                        />
                        <button className="btn btn--primary btn--icon" style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}>
                            <FiSend />
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .chat-bubble:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    )
}

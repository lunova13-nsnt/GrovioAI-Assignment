import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import Login from './Login';
import './App.css';

export default function App() {
  const [notes, setNotes]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle]           = useState('');
  const [content, setContent]       = useState('');
  const [search, setSearch]         = useState('');
  const [darkMode, setDarkMode]     = useState(false);
  const [user, setUser]             = useState(localStorage.getItem('email'));

  useEffect(() => {
    if (user) getNotes().then(res => setNotes(res.data));
  }, [user]);

  useEffect(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => {
      updateNote(selectedId, { title, content });
    }, 800);
    return () => clearTimeout(timer);
  }, [title, content, selectedId]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  const handleLogin = (email) => setUser(email);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    setNotes([]);
    setSelectedId(null);
    setTitle('');
    setContent('');
  };

  const handleSelect = (note) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCreate = async () => {
    const res = await createNote({ title: 'New Note', content: '' });
    setNotes(prev => [res.data, ...prev]);
    handleSelect(res.data);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setTitle('');
      setContent('');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  // Show login page if not logged in
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="top-bar">
          <span className="app-title">📝 Notes</span>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(prev => !prev)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* User info + logout */}
        <div className="user-bar">
          <span className="user-email">{user}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <button className="new-note-btn" onClick={handleCreate}>
          + New Note
        </button>

        <input
          className="search-input"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filteredNotes.length === 0 ? (
          <p className="no-notes">No notes found</p>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedId === note.id ? 'active' : ''}`}
              onClick={() => handleSelect(note)}
            >
              <span className="note-title">{note.title || 'Untitled'}</span>
              <button
                className="delete-btn"
                onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </aside>

      {/* Editor Panel */}
      <div className="editor-panel">
        <input
          className="title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
        />
        <textarea
          className="editor-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write Markdown here..."
        />
      </div>

      {/* Preview Panel */}
      <div className="preview-panel">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

    </div>
  );
}
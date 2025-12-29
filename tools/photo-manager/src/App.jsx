import React, { useState, useEffect, useRef } from 'react';
import { Save, AlertCircle, ImageIcon, SmilePlus, History } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const SERVER_BASE = 'http://localhost:3000';
const API_BASE = `${SERVER_BASE}/api`;

// Helper to format date for datetime-local input
const toDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  try {
    // Handle both ISO strings and "YYYY-MM-DD HH:MM:SS"
    const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const date = new Date(normalized);
    
    if (isNaN(date.getTime())) return "";
    
    // Format to YYYY-MM-DDTHH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } catch {
    return "";
  }
};

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [orphans, setOrphans] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [localNotes, setLocalNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [newDate, setNewDate] = useState('');

  const currentPhoto = photos[selectedPhotoIndex];

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPhotos(selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        if (!event.target.closest('.emoji-btn')) {
          setShowEmojiPicker(false);
        }
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (currentPhoto) {
      // Prefer ISO date for accurate time, fallback to display date
      const dateSource = currentPhoto.isoDate || currentPhoto.date;
      setNewDate(toDateTimeLocal(dateSource));
    }
  }, [currentPhoto]);


  const fetchCities = async () => {
    try {
      const res = await fetch(`${API_BASE}/cities`);
      const data = await res.json();
      setCities(data);
      if (data.length > 0 && !selectedCity) {
        setSelectedCity(data[0].name);
      }
    } catch (err) {
      console.error('Failed to fetch cities', err);
    }
  };

  const fetchPhotos = async (city) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/photos?city=${city}`);
      const data = await res.json();
      
      const filteredPhotos = (data.photos || []).filter(p => !p.isBackground);
      
      setPhotos(filteredPhotos);
      setOrphans(data.orphanedNotes);
      
      const initialNotes = {};
      filteredPhotos.forEach(p => initialNotes[p.filename] = p.note || '');
      data.orphanedNotes.forEach(o => initialNotes[o.filename] = o.note || '');
      
      setLocalNotes(initialNotes);
      setSelectedPhotoIndex(0);
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (filename, value) => {
    setLocalNotes(prev => ({ ...prev, [filename]: value }));
    setIsDirty(true);
  };

  const onEmojiClick = (emojiObject) => {
    const filename = currentPhoto.filename;
    const currentNote = localNotes[filename] || '';
    const newNote = currentNote + emojiObject.emoji;
    handleNoteChange(filename, newNote);
    setShowEmojiPicker(false);
  };

  const saveNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: selectedCity, notes: localNotes })
      });
      if (res.ok) {
        setIsDirty(false);
      }
    } catch (err) {
      console.error('Failed to save notes', err);
    }
  };

  const handleUpdateDate = async () => {
    if (!newDate || !currentPhoto) return;
    try {
      const res = await fetch(`${API_BASE}/photo/date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          filename: currentPhoto.filename,
          newDate: newDate.replace('T', ' '),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh photos to get the new date and filename
        await fetchPhotos(selectedCity);
        
        // If the file was renamed, we might want to try and find it again to keep it selected
        // But for now, staying on the same index is usually fine as the list sort order might change
        if (data.newFilename && data.newFilename !== currentPhoto.filename) {
             console.log(`File renamed to ${data.newFilename}`);
        }
      } else {
        const errorData = await res.json();
        alert(`Failed to update date: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to update date', err);
      alert('An error occurred while updating the date.');
    }
  };

  return (
    <div className="app-container">
      {/* Column 1: Cities */}
      <aside className="sidebar-cities">
        <h2>CITY</h2>
        {cities.map(city => (
          <div 
            key={city.name} 
            className={`nav-item ${selectedCity === city.name ? 'active' : ''}`}
            onClick={() => {
              if (isDirty && !confirm('Discard unsaved changes?')) return;
              setSelectedCity(city.name);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>{city.name}</span>
              <span style={{ opacity: 0.5 }}>{city.photoCount}</span>
            </div>
          </div>
        ))}
      </aside>

      {/* Column 2: Photo List */}
      <section className="photo-list-column">
        <div className="list-header">
          <div style={{ fontSize: '0.7rem', color: '#ffd700', marginBottom: '5px' }}>REWARDS</div>
          <div style={{ fontWeight: 'bold' }}>{selectedCity?.toUpperCase()}</div>
        </div>
        
        <div className="photo-items-container">
          {loading ? (
            <div style={{ padding: '20px', opacity: 0.5 }}>Loading...</div>
          ) : (
            <>
              {photos.map((photo, index) => (
                <div 
                  key={photo.filename}
                  className={`nav-item photo-item ${selectedPhotoIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <span className="list-filename">{photo.filename}</span>
                  <span className="list-date">{photo.date}</span>
                </div>
              ))}

              {orphans.length > 0 && (
                <div className="orphan-section">
                  <div className="orphan-title">
                    <AlertCircle size={14} /> Orphans
                  </div>
                  {orphans.map((orphan) => (
                    <div key={orphan.filename} className="nav-item photo-item" style={{ opacity: 0.6 }}>
                      <span className="list-filename">{orphan.filename}</span>
                      <span className="orphan-badge">MISSING FILE</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Column 3: Detail Panel */}
      <main className="detail-panel">
        {currentPhoto ? (
          <>
            <div className="preview-container">
              <div className="polaroid-frame">
                <img 
                  src={`${SERVER_BASE}${currentPhoto.url}`} 
                  className="cinematic-filter" 
                  alt="Preview" 
                />
                <div className="polaroid-note">{localNotes[currentPhoto.filename]}</div>
                <div className="polaroid-date">{currentPhoto.date}</div>
              </div>
            </div>
            
            <div className="info-pane">
              <div className="info-header">
                <div>
                  <h2>{currentPhoto.filename}</h2>
                  <div className="metadata-row">
                    <span><strong>Date:</strong> {currentPhoto.date}</span>
                    <span><strong>City:</strong> {selectedCity}</span>
                  </div>
                </div>
              </div>

              <div className="note-box-wrapper">
                <textarea 
                  className="note-box"
                  placeholder="Type your memory here..."
                  value={localNotes[currentPhoto.filename] || ''}
                  onChange={(e) => handleNoteChange(currentPhoto.filename, e.target.value)}
                />
                <button
                  className="btn emoji-btn"
                  title="Add Emoji"
                  onClick={() => setShowEmojiPicker(val => !val)}
                >
                  <SmilePlus size={18} />
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      autoFocusSearch={false}
                      lazyLoadEmojis={true}
                      theme="dark"
                    />
                  </div>
                )}
              </div>
              
              <div className="controls-section">
                <div className="save-controls">
                  <button 
                    className="btn btn-primary" 
                    onClick={saveNotes} 
                    disabled={!isDirty}
                  >
                    <Save size={18} /> Save All Changes
                  </button>
                  {isDirty && <span className="dirty-indicator">Unsaved changes in city</span>}
                </div>

                <div className="date-update-controls">
                  <input
                    type="datetime-local"
                    step="1"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="date-input"
                  />
                  <button className="btn" onClick={handleUpdateDate}>
                    <History size={18} /> Update Date
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <div style={{ textAlign: 'center' }}>
              <ImageIcon size={64} style={{ marginBottom: '10px' }} />
              <div>Select a photo to edit</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

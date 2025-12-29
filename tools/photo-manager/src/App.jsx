import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Image as ImageIcon, Eye } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

function GamePreview({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
        <button className="preview-close" onClick={onClose}>×</button>
        <div className="victory-image-container">
          <div className="polaroid-frame ken-burns-active">
            <img src={photo.url} alt="Memory" className="cinematic-filter" />
            <div className="polaroid-note">{photo.note}</div>
            <div className="polaroid-date">{photo.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [orphans, setOrphans] = useState([]);
  const [localNotes, setLocalNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPhotos(selectedCity);
    }
  }, [selectedCity]);

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
      setPhotos(data.photos);
      setOrphans(data.orphanedNotes);
      
      const initialNotes = {};
      data.photos.forEach(p => initialNotes[p.filename] = p.note);
      data.orphanedNotes.forEach(o => initialNotes[o.filename] = o.note);
      setLocalNotes(initialNotes);
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

  const saveNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: selectedCity, notes: localNotes })
      });
      if (res.ok) {
        setIsDirty(false);
        alert('Notes saved successfully!');
      }
    } catch (err) {
      console.error('Failed to save notes', err);
      alert('Failed to save notes');
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2 style={{ color: '#ffd700', marginBottom: '20px' }}>Cities</h2>
        {cities.map(city => (
          <div 
            key={city.name} 
            className={`city-item ${selectedCity === city.name ? 'active' : ''}`}
            onClick={() => {
              if (isDirty && !confirm('Discard unsaved changes?')) return;
              setSelectedCity(city.name);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{city.name}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{city.photoCount}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="main-content">
        <div className="save-bar">
          <h1>{selectedCity}</h1>
          <button 
            className="btn btn-primary" 
            onClick={saveNotes} 
            disabled={!isDirty || loading}
          >
            <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Save Changes
          </button>
        </div>

        {loading ? (
          <p>Loading photos...</p>
        ) : (
          <div className="gallery-grid">
            {photos.map(photo => (
              <div key={photo.filename} className="photo-card">
                <div style={{ position: 'relative' }}>
                  <img src={photo.url} className="photo-thumbnail" alt={photo.filename} />
                  <button 
                    className="preview-trigger"
                    title="Preview in Game"
                    onClick={() => setPreviewPhoto({ ...photo, note: localNotes[photo.filename] })}
                  >
                    <Eye size={20} />
                  </button>
                </div>
                <div className="photo-info">
                  <div className="date">{photo.date || 'No Date'}</div>
                  <div className="filename">{photo.filename}</div>
                  <textarea 
                    className="note-input"
                    placeholder="Add a memory..."
                    value={localNotes[photo.filename] || ''}
                    onChange={(e) => handleNoteChange(photo.filename, e.target.value)}
                  />
                </div>
              </div>
            ))}

            {orphans.length > 0 && (
              <div style={{ gridColumn: '1/-1', marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h2 style={{ color: '#ff4d4d', display: 'flex', alignItems: 'center' }}>
                  <AlertCircle style={{ marginRight: '10px' }} />
                  Orphaned Notes (Missing Photos)
                </h2>
                <div className="gallery-grid">
                  {orphans.map(orphan => (
                    <div key={orphan.filename} className="photo-card orphan">
                      <div className="photo-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={48} color="#444" />
                      </div>
                      <div className="photo-info">
                        <div className="orphan-badge">ORPHAN</div>
                        <div className="filename">{orphan.filename}</div>
                        <textarea 
                          className="note-input"
                          value={localNotes[orphan.filename] || ''}
                          onChange={(e) => handleNoteChange(orphan.filename, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {previewPhoto && (
        <GamePreview 
          photo={previewPhoto} 
          onClose={() => setPreviewPhoto(null)} 
        />
      )}
    </div>
  );
}

export default App;

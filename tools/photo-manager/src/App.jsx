import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, ImageIcon } from 'lucide-react';

const SERVER_BASE = 'http://localhost:3000';
const API_BASE = `${SERVER_BASE}/api`;

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [orphans, setOrphans] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [localNotes, setLocalNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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
      
      // Filter out backgrounds and arena assets as they are not reward photos
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

  const currentPhoto = photos[selectedPhotoIndex];

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

              <textarea 
                className="note-box"
                placeholder="Type your memory here..."
                value={localNotes[currentPhoto.filename] || ''}
                onChange={(e) => handleNoteChange(currentPhoto.filename, e.target.value)}
              />

              <div className="save-controls">
                <button 
                  className="btn btn-primary" 
                  onClick={saveNotes} 
                  disabled={!isDirty}
                >
                  <Save size={18} /> Save All Changes
                </button>
                {isDirty && <span style={{ color: '#ffd700', fontSize: '0.8rem', alignSelf: 'center' }}>Unsaved changes in city</span>}
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

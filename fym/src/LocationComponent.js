import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for temporary ID generation
import styles from './LocationComponent.module.css'

// Configure Leaflet's icon default paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow
});

function LocationMarker({ location, onRemove }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    console.error('Invalid location data:', location);
    return null;  // Return null if data is invalid
  }

  return (
    <Marker
      position={[location.lat, location.lng]}
      ref={markerRef}
      eventHandlers={{
        click: () => onRemove(location._id)
      }}
    >
      <Popup>
        <strong>Location:</strong> {location.name}<br />
        <strong>Coordinates:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </Popup>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        {location.name} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
      </Tooltip>
    </Marker>
  );
}

function AddLocation({ setLocations, user }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const cityName = data.address.city || data.address.town || "Unknown location";
      const newLocation = {
        _id: uuidv4(),  // Generate a temporary UUID
        lat: lat,
        lng: lng,
        name: cityName
      };

      fetch(`https://projectfym-1.onrender.com/api/businesslocationadd_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newLocation)
      })
      .then(res => res.json())
      .then(addedLocation => {
        setLocations(prev => [
          ...prev,
          newLocation
        ]);
      })
      .catch(error => {
        console.error("Error adding new location:", error);
      });

      setLocations(prev => [...prev, newLocation]);  // Temporarily add the new location with UUID
    }
  });

  return null;  // This component does not render anything itself
}

function LocationApp({ user }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch(`https://projectfym-1.onrender.com/api/businesslocations_get`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setLocations(data);
    })
    .catch(error => console.error('Failed to fetch locations:', error));
  }, [user.token]);

  const handleRemoveLocation = (locationId) => {
    fetch(`https://projectfym-1.onrender.com/api/businesslocationdelete_post/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    .then(response => {
      if (response.ok) {
        setLocations(locations => locations.filter(location => location._id !== locationId));
      } else {
        throw new Error('Failed to delete the location');
      }
    })
    .catch(error => console.error('Error removing location:', error));
  };

  return (
    <div className="location-app">
      <h1 className={styles.font} style={{color:'#DE3163',textAlign:'center',marginBottom:'15px'}}>Mark the Memories!</h1>
      <MapContainer center={[15.9129, 79.7400]} zoom={7} style={{ width: '100%', height: '70vh' ,border:'5px solid lightblue',borderRadius:'5px'}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AddLocation setLocations={setLocations} user={user} />
        {locations && locations.length>0 && locations.map(location => (
          <LocationMarker
            key={location._id}
            location={location}
            onRemove={handleRemoveLocation}
          />
        ))}
      </MapContainer>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(LocationApp);

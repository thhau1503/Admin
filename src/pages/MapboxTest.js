import React, { useEffect, useRef, useState } from 'react';

const MapWithSearch = () => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState({ lat: 10.7769, lng: 106.7009 }); // Ho Chi Minh City

  useEffect(() => {
    const loadHereMap = async () => {
      const H = window.H;

      // Khởi tạo nền tảng HERE
      const platform = new H.service.Platform({
        apikey: '99537e37c963428d819a8e830301e0fb',
      });

      const defaultLayers = platform.createDefaultLayers();

      const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
        center: position,
        zoom: 13,
      });

      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      H.ui.UI.createDefault(map, defaultLayers);

      // Đặt marker
      const marker = new H.map.Marker(position);
      map.addObject(marker);

      return () => {
        map.dispose();
      };
    };

    if (window.H) {
      loadHereMap();
    } else {
      console.error('HERE Maps script chưa được tải.');
    }
  }, [position]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          address
        )}&apiKey=99537e37c963428d819a8e830301e0fb`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setSuggestions(data.items);
      } else {
        alert('Không tìm thấy địa chỉ.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const { lat, lng } = suggestion.position;
    setPosition({ lat, lng });
    setAddress(suggestion.address.label);
    setSuggestions([]);
  };

  return (
    <div>
      <h1>Bản đồ HERE Maps với Tìm kiếm</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Nhập địa chỉ"
          required
        />
        <button type="submit">Tìm kiếm</button>
      </form>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
            {suggestion.address.label}
          </li>
        ))}
      </ul>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px', marginTop: '20px' }}
      ></div>
    </div>
  );
};

export default MapWithSearch;

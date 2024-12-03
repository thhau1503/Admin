import React, { useState } from "react";
import axios from "axios";

const GeocodingTest = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");

  const handleGeocode = async () => {
    try {
      console.log("address", address);
      const apiKey = "9YHLYJH0cPEqnF9yCHOUrY23rEQKZp9v8vUmdQmS"; // Thay bằng API key của bạn
      const response = await axios.get("https://rsapi.goong.io/geocode", {
        params: {
          address: address,
          api_key: apiKey,
        },
      });
      
      console.log("response", response);  
      if (response.data.results && response.data.results.length > 0) {
        setCoordinates(response.data.results[0].geometry.location);
        setError("");
      } else {
        setError("Không tìm thấy tọa độ cho địa chỉ này.");
        setCoordinates(null);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gọi API.");
      setCoordinates(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test chuyển địa chỉ thành tọa độ</h1>
      <div>
        <label htmlFor="address">Nhập địa chỉ: </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "300px" }}
        />
        <button onClick={handleGeocode} style={{ padding: "5px 10px" }}>
          Lấy tọa độ
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        {coordinates && (
          <div>
            <h2>Tọa độ:</h2>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default GeocodingTest;

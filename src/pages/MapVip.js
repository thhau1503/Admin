import React from "react";
import GoongMapReact from "@goongmaps/goong-map-react";

const SimpleMap = () => {
  const apiKey = "YOcMw2iSFoENJVwSjQjTPLCqI5mRJfxLSwoI2uSw"; // Thay bằng API Key chính xác
  const defaultLocation = { lat: 21.028511, lng: 105.804817 }; // Tọa độ Hồ Gươm, Hà Nội

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {apiKey ? (
        <GoongMapReact
          goongApiAccessToken={apiKey}
          style={{ width: "100%", height: "100%" }}
          center={defaultLocation}
          zoom={12}
        />
      ) : (
        <p>API Key chưa được cấu hình!</p>
      )}
    </div>
  );
};

export default SimpleMap;

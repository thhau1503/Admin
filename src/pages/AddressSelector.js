import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressSelector = () => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Lấy dữ liệu tỉnh/thành phố, quận/huyện, phường/xã
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Xử lý khi chọn tỉnh/thành phố
  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    setSelectedDistrict("");
    setSelectedWard("");
    if (cityId) {
      const city = cities.find((city) => city.Id === cityId);
      setDistricts(city.Districts);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard("");
    if (districtId) {
      const district = districts.find((district) => district.Id === districtId);
      setWards(district.Wards);
    } else {
      setWards([]);
    }
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  // Hiển thị địa chỉ đã chọn
  const getFullAddress = () => {
    if (!selectedCity) return "Chưa chọn địa chỉ";
    const city = cities.find((city) => city.Id === selectedCity)?.Name || "";
    const district =
      districts.find((district) => district.Id === selectedDistrict)?.Name || "";
    const ward = wards.find((ward) => ward.Id === selectedWard)?.Name || "";
    return `${ward ? ward + ", " : ""}${district ? district + ", " : ""}${city}`;
  };

  return (
    <div>
      <div>
        <label>Tỉnh/Thành phố:</label>
        <select
          className="form-select form-select-sm mb-3"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option value="">Chọn tỉnh thành</option>
          {cities.map((city) => (
            <option key={city.Id} value={city.Id}>
              {city.Name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Quận/Huyện:</label>
        <select
          className="form-select form-select-sm mb-3"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedCity}
        >
          <option value="">Chọn quận huyện</option>
          {districts.map((district) => (
            <option key={district.Id} value={district.Id}>
              {district.Name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Phường/Xã:</label>
        <select
          className="form-select form-select-sm"
          value={selectedWard}
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường xã</option>
          {wards.map((ward) => (
            <option key={ward.Id} value={ward.Id}>
              {ward.Name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        <span>Địa chỉ đã chọn: {getFullAddress()}</span>
      </div>
    </div>
  );
};

export default AddressSelector;

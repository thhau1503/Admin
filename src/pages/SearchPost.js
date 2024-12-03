import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchPost = () => {
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    city: "",
    district: "",
    ward: "",
    roomType: "",
    priceMin: "",
    priceMax: "",
  });

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=2"
        );
        setLocations(response.data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (searchParams.city) {
      const selectedCity = locations.find((loc) => loc.name === searchParams.city);
      setFilteredDistricts(selectedCity?.districts || []);
      setFilteredWards([]);
    }
  }, [searchParams.city, locations]);

  useEffect(() => {
    if (searchParams.district) {
      const selectedDistrict = filteredDistricts.find(
        (district) => district.name === searchParams.district
      );
      setFilteredWards(selectedDistrict?.wards || []);
    }
  }, [searchParams.district, filteredDistricts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const { title, location, roomType, priceMin, priceMax, city, district, ward } = searchParams;
      const response = await axios.get("https://be-android-project.onrender.com/api/post/search", {
        params: { title, location, roomType, priceMin, priceMax, city, district, ward },
      });
      setPosts(response.data);
      setError("");
    } catch (err) {
      setError("Không thể tìm kiếm bài viết. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h1>Tìm kiếm bài viết</h1>
      <div>
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={searchParams.title}
          onChange={handleChange}
        />
        <select name="city" value={searchParams.city} onChange={handleChange}>
          <option value="">Chọn thành phố</option>
          {locations.map((city) => (
            <option key={city.code} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          name="district"
          value={searchParams.district}
          onChange={handleChange}
          disabled={!searchParams.city}
        >
          <option value="">Chọn quận/huyện</option>
          {filteredDistricts.map((district) => (
            <option key={district.code} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
        <select
          name="ward"
          value={searchParams.ward}
          onChange={handleChange}
          disabled={!searchParams.district}
        >
          <option value="">Chọn phường/xã</option>
          {filteredWards.map((ward) => (
            <option key={ward.code} value={ward.name}>
              {ward.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="roomType"
          placeholder="Loại phòng"
          value={searchParams.roomType}
          onChange={handleChange}
        />
        <input
          type="number"
          name="priceMin"
          placeholder="Giá tối thiểu"
          value={searchParams.priceMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Giá tối đa"
          value={searchParams.priceMax}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Kết quả tìm kiếm</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>Thành phố: {post.location.city}</p>
              <p>Quận: {post.location.district}</p>
              <p>Phường: {post.location.ward}</p>
              <p>Loại phòng: {post.roomType}</p>
              <p>Giá: {post.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPost;

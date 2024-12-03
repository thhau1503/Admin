import React, { useState } from "react";
import { createPost } from "../api/post";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react"; // Thêm useContext vào đây
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Lấy user từ AuthContext
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    location: {
      address: "",
      city: "",
      district: "",
      ward: "",
      geoLocation: { latitude: 0, longitude: 0 },
    },
    landlord: user ? user.id : null,
    roomType: "Single", // Default value for roomType
    size: 0,
    availability: true,
    amenities: {
      wifi: false,
      airConditioner: false,
      heater: false,
      kitchen: false,
      parking: false,
    },
    additionalCosts: {
      electricity: 0,
      water: 0,
      internet: 0,
      cleaning: 0,
    },
    images: [],
    videos: [],
    averageRating: 0,
    views: 0,
    status: "Active", // Default status
  });

  const [message, setMessage] = useState(""); // State for feedback messages
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const [key, subKey] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [key]: { ...prevData[key], [subKey]: checked },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, [key]: value },
      }));
    } else if (name.startsWith("additionalCosts.")) {
      const key = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        additionalCosts: {
          ...prevData.additionalCosts,
          [key]: parseFloat(value),
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file)); // Create URLs for preview

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...newImages],
    }));
  };

  const removeImage = (index) => {
    setFormData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      return { ...prevData, images: updatedImages };
    });
  };
  const handleSubmit = async (e) => {
    if (!user || user.role !== "Renter") {
      navigate("/phone"); // Điều hướng đến trang phone nếu người dùng không phải là người thuê
      return; // Dừng hàm
    }

    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setMessage(""); // Đặt lại thông báo
    setIsLoading(true); // Bắt đầu trạng thái tải lên

    try {
      const response = await createPost(formData); // Gửi dữ liệu form để tạo bài đăng
      console.log(formData); // In ra dữ liệu trước khi gửi yêu cầu
      console.log("Bài đăng đã được tạo thành công:", response.data); // Kiểm tra phản hồi
      setMessage("Bài đăng đã được tạo thành công!"); // Thông báo thành công
    } catch (error) {
      console.error("Lỗi khi tạo bài đăng:", error);
      console.error("Chi tiết lỗi:", error.response?.data); // Sử dụng optional chaining để tránh lỗi
      setMessage(error.response?.data?.message || "Đã xảy ra lỗi."); // Hiển thị thông báo lỗi
    } finally {
      setIsLoading(false); // Đặt trạng thái tải lên về false trong mọi trường hợp
    }
  };
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Đăng tin</h2>
      {message && <div className="text-red-600">{message}</div>}{" "}
      {/* Display message */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thành phố
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quận
              </label>
              <input
                type="text"
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phường
              </label>
              <input
                type="text"
                name="location.ward"
                value={formData.location.ward}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {/* GeoLocation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vĩ độ
              </label>
              <input
                type="number"
                name="location.geoLocation.latitude"
                value={formData.location.geoLocation.latitude}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kinh độ
              </label>
              <input
                type="number"
                name="location.geoLocation.longitude"
                value={formData.location.geoLocation.longitude}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại phòng
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Single">Phòng đơn</option>
              <option value="Shared">Phòng chia sẻ</option>
              <option value="Apartment">Căn hộ</option>
              <option value="Dormitory">Ký túc xá</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Diện tích (m²)
            </label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={(e) => {
                  setFormData({ ...formData, availability: e.target.checked });
                }}
                className="mr-2"
              />
              Có sẵn
            </label>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">Tiện nghi</h3>
            {Object.keys(formData.amenities).map((key) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={`amenities.${key}`}
                  checked={formData.amenities[key]}
                  onChange={handleChange}
                  className="mr-2"
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>

          {/* Additional Costs */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">Chi phí thêm</h3>
            {Object.keys(formData.additionalCosts).map((key) => (
              <div key={key} className="flex items-center">
                <label className="mr-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                <input
                  type="number"
                  name={`additionalCosts.${key}`}
                  value={formData.additionalCosts[key]}
                  onChange={handleChange}
                  className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="mt-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-md mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-sm"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video (URL)
            </label>
            <input
              type="text"
              name="videos"
              value={formData.videos.join(", ")}
              onChange={(e) => {
                const urls = e.target.value.split(",").map((url) => url.trim());
                setFormData({ ...formData, videos: urls });
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-4 px-4 py-2 font-medium text-white rounded-md ${
                isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {isLoading ? "Đang tạo..." : "Tạo bài viết"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

import axios from "axios";

const token = localStorage.getItem("token");

const adminAPI = axios.create({
    baseURL: "https://be-android-project.onrender.com/api",
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export default adminAPI;
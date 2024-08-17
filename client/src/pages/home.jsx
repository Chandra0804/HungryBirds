import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaImage, FaSearch } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Select Location");
  const [country, setCountry] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const [cuisines, setCuisines] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: 12,
          search,
          city:
            location === "Select Location" || location === "Current Location"
              ? ""
              : location,
          country,
          averageCost,
          cuisines,
          lat,
          lng,
          radius: lat && lng ? 100000 : undefined,
        };

        const response = await axios.get(`http://localhost:3000/restaurants`, {
          params,
        });
        setRestaurants(response.data.restaurants);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, search, location, country, averageCost, cuisines, lat, lng]);

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const resetPage = () => {
    setPage(1);
  };

  const handleLocationChange = async (e) => {
    const newLocation = e.target.value;
    setLoading(true);
    setLocation(newLocation);

    if (newLocation === "Select Location") {
      setLat(null);
      setLng(null);
    } else if (newLocation === "Current Location") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Failed to retrieve your location.");
        }
      );
    } else {
      setLocation(newLocation);
    }
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setShowImageModal(true);
  };

  const handleImageSearch = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/restaurants/search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRestaurants(response.data.restaurants);
      setTotalPages(1);
      setShowImageModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to search restaurants by image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Bar with Logo and Search */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
  Hungry Birds
</h1>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-96"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1546069901-eacef0df6022?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
              Find the Best Restaurants in Town
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
              <select
                value={location}
                onChange={(e) => {
                  handleLocationChange(e);
                  resetPage();
                }}
                className="px-4 py-2 rounded-md border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Select Location">Select Location</option>
                <option value="Current Location">Current Location</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="New Delhi">New Delhi</option>
              </select>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  resetPage();
                }}
                className="px-4 py-2 rounded-lg border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="Brazil">Brazil</option>
              </select>
              <select
                value={averageCost}
                onChange={(e) => {
                  setAverageCost(e.target.value);
                  resetPage();
                }}
                className="px-4 py-2 rounded-lg border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Average Cost</option>
                <option value="500">Up to 500</option>
                <option value="1000">500 - 1000</option>
                <option value="2000">1000 - 2000</option>
                <option value="3000">2000 - 3000</option>
              </select>
              <select
                value={cuisines}
                onChange={(e) => {
                  setCuisines(e.target.value);
                  resetPage();
                }}
                className="px-4 py-2 rounded-lg border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Cuisines</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
              </select>
              <button
                onClick={() => setShowImageModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
              >
                <FaImage className="inline-block mr-2" />
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Restaurants
        </h2>

        <div className="flex justify-center mb-4"></div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-orange-500 animate-spin text-4

xl" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.restaurantID}
                to={`/restaurants/${restaurant._id}`}
              >
                <RestaurantCard restaurant={restaurant} />
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upload an Image
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {previewImage && (
            <div className="mb-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => setShowImageModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleImageSearch}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
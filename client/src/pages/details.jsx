import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaMapMarkerAlt, FaUtensils, FaDollarSign, FaStar, FaVoteYea } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="text-orange-500 animate-spin text-4xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <p className="text-center text-red-500">Restaurant not found</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={restaurant.thumb || restaurant.featured_image || 'https://via.placeholder.com/800'}
            alt={restaurant.name}
            className="w-full h-96 object-cover mb-6"
          />
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center text-gray-700 mb-4">
                <FaMapMarkerAlt className="text-orange-500 mr-2" />
                <p><strong>Address:</strong> {restaurant.location.address}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaMapMarkerAlt className="text-orange-500 mr-2" />
                <p><strong>City:</strong> {restaurant.location.city}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaMapMarkerAlt className="text-orange-500 mr-2" />
                <p><strong>Locality:</strong> {restaurant.location.locality}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaUtensils className="text-orange-500 mr-2" />
                <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaDollarSign className="text-orange-500 mr-2" />
                <p><strong>Average Cost for Two:</strong> {restaurant.currency} {restaurant.average_cost_for_two}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaDollarSign className="text-orange-500 mr-2" />
                <p><strong>Price Range:</strong> {restaurant.price_range}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaStar className="text-orange-500 mr-2" />
                <p><strong>Rating:</strong> {restaurant.user_rating.aggregate_rating} ({restaurant.user_rating.rating_text})</p>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <FaVoteYea className="text-orange-500 mr-2" />
                <p><strong>Votes:</strong> {restaurant.user_rating.votes}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <MapContainer
              center={[restaurant.location.latitude, restaurant.location.longitude]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
              className="rounded-lg shadow"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[restaurant.location.latitude, restaurant.location.longitude]}>
                <Popup>{restaurant.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
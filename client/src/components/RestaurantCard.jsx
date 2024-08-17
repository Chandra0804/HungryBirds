import React from 'react';
import { FaStar } from "react-icons/fa";

export default function RestaurantCard({ restaurant }) {
    console.log(restaurant)
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 max-w-xs mx-auto relative group">
      <img
        src={
          restaurant.thumb ||
          restaurant.featured_image ||
          "https://via.placeholder.com/400"
        }
        alt={restaurant.restaurantName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col justify-between h-36">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate relative">
          {restaurant.name}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="text-gray-700">
              {restaurant.user_rating.aggregate_rating}
            </span>
          </div>
          <p className="text-gray-500">{restaurant.location.city}</p>
        </div>
      </div>
    </div>
  )
}
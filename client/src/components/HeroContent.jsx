import React from 'react'

export default function HeroContent() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="text-center text-white">
      <h1 className="text-5xl font-bold mb-6">Find the Best Restaurants in Town</h1>
      <div className="flex flex-col md:flex-row justify-center items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <select
          onChange={e => onImageUpload(e)}
          className="px-4 py-2 rounded-md border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Select Location">Select Location</option>
          <option value="Current Location">Current Location</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Columbus">Columbus</option>
        </select>
        <select
          onChange={e => onImageUpload(e)}
          className="px-4 py-2 rounded-lg border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="Brazil">Brazil</option>
        </select>
        <select
          onChange={e => onImageUpload(e)}
          className="px-4 py-2 rounded-lg border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Average Cost</option>
          <option value="500">Up to 500</option>
          <option value="1000">500 - 1000</option>
          <option value="2000">1000 - 2000</option>
          <option value="3000">2000 - 3000</option>
        </select>
        <select
          onChange={e => onImageUpload(e)}
          className="px-4 py-2 rounded-lg border border-transparent bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Cuisines</option>
          <option value="Chinese">Chinese</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
        </select>
        <button
          onClick={() => onImageUpload(null)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
        >
          <FaImage className="inline-block mr-2" />
          Upload Image
        </button>
      </div>
    </div>
  </div>
  )
}

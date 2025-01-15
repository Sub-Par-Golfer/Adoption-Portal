import React, { useEffect } from "react";
import "../Navbar.css";

function Navbar({
  speciesOptions,
  ageOptions,
  sizeOptions,
  setFilters,
  filters,
  handleSubmit,
  paginationInfo,
  currentPage,
  setCurrentPage,
  fetchPets,
}) {
  // Function to get user's location and update the Zip Code field
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Use a geocoding API to convert coordinates to a Zip Code
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const postalCode = data.postcode;

            if (postalCode) {
              setFilters((prevFilters) => ({
                ...prevFilters,
                location: postalCode,
              }));
              // Automatically trigger form submission
              fetchPets();
            }
          } catch (error) {
            console.error("Error fetching location:", error);
          }
        },
        (error) => {
          console.warn("Geolocation permission denied or unavailable:", error);
        }
      );
    }
  };

  // Automatically get location on page load
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="navbar">
      <h1>Adoption Portal</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Species:
          <select
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Any</option>
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </label>

        <label>
          Age:
          <select
            onChange={(e) => setFilters({ ...filters, age: e.target.value })}
          >
            <option value="">Any</option>
            {ageOptions.map((age) => (
              <option key={age} value={age.toLowerCase()}>
                {age}
              </option>
            ))}
          </select>
        </label>

        <label>
          Size:
          <select
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          >
            <option value="">Any</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size.toLowerCase()}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <label>
          Zip Code (Optional):
          <input
            type="text"
            value={filters.location}
            placeholder="Enter Zip Code"
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
        </label>

        <label>
          Distance (miles):
          <select
            onChange={(e) =>
              setFilters({ ...filters, distance: e.target.value })
            }
            defaultValue="25"
          >
            <option value="Any">Any</option>
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            onChange={(e) =>
              setFilters({ ...filters, hasImages: e.target.checked })
            }
          />
          Only show pets with images
        </label>

        <button type="submit">Search</button>
      </form>

      <div className="pagination-controls">
        {paginationInfo && (
          <>
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  fetchPets(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {paginationInfo?.total_pages || 1}
            </span>
            <button
              onClick={() => {
                if (
                  paginationInfo.total_pages &&
                  currentPage < paginationInfo.total_pages
                ) {
                  setCurrentPage(currentPage + 1);
                  fetchPets(currentPage + 1);
                }
              }}
              disabled={
                paginationInfo.total_pages &&
                currentPage >= paginationInfo.total_pages
              }
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
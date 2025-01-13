import React, { useEffect, useState } from "react";
import axios from "axios";
import PetList from "./components/PetList";

function App() {
  const [pets, setPets] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [outsideArea, setOutsideArea] = useState(false);
  const [outsidePets, setOutsidePets] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    age: "",
    size: "",
    location: "",
    distance: "",
  });

  // Function to get access token
  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://api.petfinder.com/v2/oauth2/token",
        {
          grant_type: "client_credentials",
          client_id: process.env.REACT_APP_PETFINDER_API_KEY,
          client_secret: process.env.REACT_APP_PETFINDER_API_SECRET,
        }
      );
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response ? error.response.data : error
      );
    }
  };

  // Function to fetch species and search values
  const fetchSearchValues = async () => {
    try {
      const response = await axios.get("https://api.petfinder.com/v2/types", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const types = response.data.types;

      // Collect all unique ages and sizes
      const ageLabels = ["Baby", "Young", "Adult", "Senior"];
      const sizeLabels = ["Small", "Medium", "Large", "Extra Large"];

      // Set species options
      setSpeciesOptions(types.map((type) => type.name));

      // Set age and size options
      setAgeOptions(ageLabels);
      setSizeOptions(sizeLabels);
    } catch (error) {
      console.error("Error fetching search values:", error);
      alert("Failed to fetch search values. Please try again later.");
    }
  };

  // Function to fetch pets based on filters
  const fetchPets = async (page = 1) => {
    try {
      const response = await axios.get("https://api.petfinder.com/v2/animals", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 25,
          page,
        },
      });
  
      setPets(response.data.animals);
      setPaginationInfo(response.data.pagination);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPets();
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchPets(currentPage);
    }
  }, [accessToken, currentPage]);

  useEffect(() => {
    if (accessToken) {
      fetchSearchValues();
    }
  }, [accessToken]);

  return (
    <div className="App">
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
        <button type="submit">Search</button>
      </form>
      <div>
  {paginationInfo && (
    <div style={{ marginTop: "20px" }}>
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
      <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
      <button
        onClick={() => {
          if (paginationInfo.total_pages && currentPage < paginationInfo.total_pages) {
            setCurrentPage(currentPage + 1);
            fetchPets(currentPage + 1);
          }
        }}
        disabled={paginationInfo.total_pages && currentPage >= paginationInfo.total_pages}
      >
        Next
      </button>
    </div>
  )}
</div>
      <PetList pets={pets} outsidePets={outsidePets} />
    </div>
  );
}

export default App;

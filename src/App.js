import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import PetList from "./components/PetList";

function App() {
  const [pets, setPets] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    age: "",
    size: "",
    location: "",
    distance: "25",
  });
  const [accessToken, setAccessToken] = useState("");

  // Fetch access token
  const getAccessToken = async () => {
    try {
      const existingToken = localStorage.getItem("accessToken");
      if (existingToken) return existingToken;

      const response = await axios.post(
        "https://api.petfinder.com/v2/oauth2/token",
        {
          grant_type: "client_credentials",
          client_id: process.env.REACT_APP_PETFINDER_API_KEY,
          client_secret: process.env.REACT_APP_PETFINDER_API_SECRET,
        }
      );

      const token = response.data.access_token;
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  // Fetch search values
  const fetchSearchValues = async () => {
    const token =
      localStorage.getItem("accessToken") || (await getAccessToken());

    try {
      const response = await axios.get("https://api.petfinder.com/v2/types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.types;

      const species = data.map((type) => type.name);
      const ages = Array.from(new Set(data.flatMap((type) => type.ages || [])));
      const sizes = Array.from(
        new Set(data.flatMap((type) => type.sizes || []))
      );

      setSpeciesOptions(species);
      setAgeOptions(ages);
      setSizeOptions(sizes);
    } catch (error) {
      console.error("Error fetching search values:", error);
    }
  };

  // Fetch pets function
  const fetchPets = async (page = 1) => {
    setIsLoading(true); // Start loading state
    const token =
      localStorage.getItem("accessToken") || (await getAccessToken());

    try {
      const params = {
        limit: 15,
        page: page,
      };

      if (filters.type) params.type = filters.type;
      if (filters.age) params.age = filters.age;
      if (filters.size) params.size = filters.size;
      if (filters.location) {
        params.location = filters.location;
        if (filters.distance && filters.distance !== "Any") {
          params.distance = filters.distance;
        }
      }

      const response = await axios.get("https://api.petfinder.com/v2/animals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      const animalsWithImages = response.data.animals.filter(
        (animal) => animal.photos.length > 0
      );

      setPets(animalsWithImages);
      setPaginationInfo(response.data.pagination);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPets(1);
  };

  // Fetch access token on app load
  useEffect(() => {
    getAccessToken();
    fetchSearchValues();
    fetchPets();
  }, []);

  // Fetch pets whenever accessToken or currentPage changes
  useEffect(() => {
    if (accessToken) {
      fetchPets(currentPage);
    }
  }, [accessToken, currentPage]);

  return (
    <div className="App">
      <Navbar
        speciesOptions={speciesOptions}
        ageOptions={ageOptions}
        sizeOptions={sizeOptions}
        setFilters={setFilters}
        filters={filters}
        handleSubmit={handleSubmit}
        paginationInfo={paginationInfo}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchPets={fetchPets}
        getAccessToken={getAccessToken} // Pass the function as a prop
      />
      <PetList pets={pets} isLoading={isLoading} />
    </div>
  );
}

export default App;
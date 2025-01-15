import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import PetList from './components/PetList';

function App() {
  const [pets, setPets] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    age: '',
    size: '',
    location: '',
    distance: '25',
  });
  const [accessToken, setAccessToken] = useState('');

  // Fetch access token
  const fetchAccessToken = async () => {
    try {
      const response = await axios.post('https://api.petfinder.com/v2/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_PETFINDER_API_KEY,
        client_secret: process.env.REACT_APP_PETFINDER_API_SECRET,
      });
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  // Fetch pets function
  const fetchPets = async (page = 1) => {
    try {
      const params = {
        limit: 15, // Reduce to 15 listings per page
        page,
      };
  
      if (filters.type) params.type = filters.type;
      if (filters.age) params.age = filters.age;
      if (filters.size) params.size = filters.size;
      if (filters.location) {
        params.location = filters.location;
        if (filters.distance && filters.distance !== 'Any') {
          params.distance = filters.distance;
        }
      }
  
      const response = await axios.get('https://api.petfinder.com/v2/animals', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });
  
      const animalsWithImages = response.data.animals.filter(
        (animal) => animal.photos.length > 0
      );
  
      setPets(animalsWithImages);
      setPaginationInfo(response.data.pagination);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // If no filters are applied, fetch random pets
    if (!filters.type && !filters.age && !filters.size && !filters.location) {
      fetchPets();
    } else {
      fetchPets();
    }
  };

  // Fetch access token on app load
  useEffect(() => {
    fetchAccessToken();
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
      />
      <PetList pets={pets} />
    </div>
  );
}

export default App;
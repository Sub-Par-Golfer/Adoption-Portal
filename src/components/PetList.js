import React from "react";
import "../PetList.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PetList({ pets, isLoading }) {
  if (isLoading) {
    return (
      <div>
        <h1>Available Animals</h1>
        <div className="pet-grid">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="pet-card">
              <Skeleton height={20} width={150} style={{ marginBottom: "10px" }} />
              <Skeleton height={200} />
              <div className="pet-info">
                <Skeleton height={20} width={100} />
                <Skeleton height={20} width={80} style={{ margin: "10px 0" }} />
                <Skeleton height={20} width={120} />
              </div>
              <Skeleton height={30} width={100} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return <p>No pets found. Please try again later.</p>;
  }

  return (
    <div>
      <h1>Available Animals</h1>
      <div className="pet-grid">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <h3>{pet.name}</h3>
            {pet.photos.length > 0 ? (
              <img
                src={pet.photos[0].medium}
                alt={pet.name}
                className="pet-image"
              />
            ) : (
              <p style={{ color: "#888" }}>No image available</p>
            )}
            <div className="pet-info">
              <span>Type: {pet.type}</span>
              <span>Age: {pet.age}</span>
              <span>Size: {pet.size}</span>
            </div>
            <a
              href={`https://www.petfinder.com/petdetail/${pet.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="adopt-link"
            >
              Adopt {pet.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetList;
import React from 'react';

function PetList({ pets }) {
  if (pets.length === 0) {
    return <p>No pets found. Please try again later.</p>;
  }

  return (
    <div>
      <h2>Available Animals</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {pets.map((pet) => (
          <div
            key={pet.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              width: '250px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3>{pet.name}</h3>
            <p>Type: {pet.type}</p>
            <p>Age: {pet.age}</p>
            <p>Size: {pet.size}</p>
            {pet.photos.length > 0 && (
              <img
                src={pet.photos[0].medium}
                alt={pet.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
            <a
              href={`https://www.petfinder.com/petdetail/${pet.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                textAlign: 'center',
              }}
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
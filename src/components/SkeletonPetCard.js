import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonPetCard = () => {
  return (
    <div className="pet-card skeleton">
      <Skeleton height={200} /> {/* Image placeholder */}
      <Skeleton count={1} height={30} style={{ marginTop: '10px' }} /> {/* Name placeholder */}
      <Skeleton count={1} height={20} width={`80%`} /> {/* Age placeholder */}
      <Skeleton count={1} height={20} width={`60%`} /> {/* Size placeholder */}
      <Skeleton count={1} height={20} width={`40%`} /> {/* Adopt button placeholder */}
    </div>
  );
};

export default SkeletonPetCard;
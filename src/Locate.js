import React from 'react'

function Locate({ panTo }) {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    panTo({ lat: crd.latitude, lng: crd.longitude })
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  return (
    <button className='locate' onClick={() => {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }}>
      <img src="https://img.icons8.com/fluency/48/000000/worldwide-location.png" alt="location-imag" />
    </button>
  )
}

export default Locate

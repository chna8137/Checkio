import { useEffect, useState } from 'react'

interface Location {
    latitude: number
    longitude: number
}

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState<Location>();
  const [error, setError] = useState('');

  const handleSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords

    setLocation({
      latitude,
      longitude,
    })
  }

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message)
  }

  useEffect(() => {
    const { geolocation } = navigator

    if (!geolocation) {
      setError('Geolocation is not supported.')
      return
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options)
  }, [options])

  return { location, error }
}
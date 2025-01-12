import React from 'react';
import './MaterialLocationSelector.scss'
import { FieldValues, UseFormSetValue } from 'react-hook-form';

const locationRegex = /^[a-zA-Z][1-9][0-9]?$/;

type Props<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
}

export const MaterialLocationSelector = <T extends FieldValues>(props: Props<T>) => {
  const { setValue } = props
  const [location, setLocation] = React.useState<string>('');
  const [locations, setLocations] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');

  const removeLocation = (locationToRemove) => {
    setLocations(locations.filter((loc) => loc!== locationToRemove));
    setValue('locations', locations);
  }

  const addLocation = (e) => {
    e.preventDefault();

    const newLocation = location.trim().toUpperCase();

    if (!newLocation) return;

    if (locations.includes(newLocation)) {
      setErrorMessage('Location already exists');
      return;
    }

    if (!locationRegex.test(newLocation)) {
      setErrorMessage('Location must start with a letter and end with a number between 1 and 99 (Ex: C98)');
    } else {
      setLocations((prevLocations) => {
        const updatedLocations = [...prevLocations, newLocation];
        setValue('locations', updatedLocations);
        return updatedLocations;
      });
      setLocation('');
      setErrorMessage('');
    }
  }

  return (
    <div>
      <p>Material Location(s)</p>
      <span className='location-error-message'>{errorMessage}</span>
      <input id='material-location-input' type='text' placeholder='Ex: C13' onChange={(e) => setLocation(e.target.value)}></input>
      <button onClick={addLocation}>Click me Location</button>
      <div>
        {locations.map((location, index) => (
          <LocationCard location={location} handleRemoveLocation={removeLocation} key={index} />
        ))}
      </div>
    </div>
  )
}

const LocationCard = ({location, handleRemoveLocation }) => {
  return (
    <div>
      <p>Location: {location} </p>
      <button onClick={() => handleRemoveLocation(location)}>Remove Location</button>
    </div>
  )
}
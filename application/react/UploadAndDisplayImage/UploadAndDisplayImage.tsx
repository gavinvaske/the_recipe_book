import React, { useState } from "react";
import { useErrorMessage } from "../_hooks/useErrorMessage";
import axios from 'axios';

type MimeType = 'image/jpeg' | 'image/png' | 'image/jpg';

type Props = {
  apiEndpoint: string,
  acceptedMimeTypes: MimeType[] 
}

export const UploadAndDisplayImage = (props: Props) => {
  const { apiEndpoint, acceptedMimeTypes } = props;
  const [selectedImage, setSelectedImage] = useState(null);

  const clearSelectedImage = () => {
    const fileInputField = document.getElementById('image-upload');

    if (!fileInputField) {
      useErrorMessage(new Error('No file input field found. Contact a developer to fix this issue.'));
      return
    }

    setSelectedImage(null)
    
    fileInputField.value = null; // Reset the file input field to nothing
  }

  const deleteImage = async () => {
    alert('TODO @Storm: Work with Gavin to add a confirmation dialog before deleting the profile picture (hint @gavin: [hasUserConfirmed, setHasUserConfirmed])');
    
    clearSelectedImage();

  }

  const saveImage = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      useErrorMessage(new Error('No file selected. Refresh and try again.'));
      return;
    }

    console.log('the file to upload is: ', file); // Log the selected file

    setSelectedImage(file); // Update the state with the selected file
    let formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`${apiEndpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      clearSelectedImage();
      useErrorMessage(error)
    }
  }

  const allowedMimeTypes = acceptedMimeTypes.join(', ');

  // Return the JSX for rendering
  return (
    <div>
      {/* Header */}
      <h1>Upload and Display Image</h1>
      <h3>using React Hooks</h3>
      <p>Is selected image? - {selectedImage ? 'true' : 'false'}</p>

      {/* Conditionally render the selected image if it exists */}
      {selectedImage && (
        <div>
          {/* Display the selected image */}
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br /> <br />
          {/* Button to remove the selected image */}
          <button onClick={() => deleteImage()}>Click to Delete my Profile Picture</button>
        </div>
      )}

      <br />

      <div className="photo-details">
        <input
          id='image-upload'
          type="file"
          name="image"
          accept={allowedMimeTypes}
          // Event handler to capture file selection and update the state
          onChange={(event) => saveImage(event)}
        />

        <p>Allowed {allowedMimeTypes}. Max size 800kb.</p>
      </div>
    </div>
  );
};

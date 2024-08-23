import React, { useState } from "react";
import { useErrorMessage } from "../_hooks/useErrorMessage";
import axios from 'axios';
import './UploadProfilePicture.scss';
import { Image } from "../_global/Image/Image";

type MimeType = 'image/jpeg' | 'image/png' | 'image/jpg';

type Props = {
  apiEndpoint: string,
  acceptedMimeTypes: MimeType[] 
}

export const UploadProfilePicture = (props: Props) => {
  const { apiEndpoint, acceptedMimeTypes } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

    setSelectedImage(file);
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

  return (
    <div>
      <h1>Click to Upload an Image</h1>

      <div>
        <Image img={selectedImage} width={250}/>
        <br /> <br />
        <button onClick={() => deleteImage()}>Click to Delete my Profile Picture</button>
      </div>

      <br />
      <div className="photo-details">
        <input
          id='image-upload'
          type="file"
          name="image"
          accept={allowedMimeTypes}
          onChange={(event) => saveImage(event)}
        />

        <p>Allowed: {allowedMimeTypes}. Max size 800KB.</p>
      </div>
    </div>
  );
};

import axios from 'axios';

async function uploadImage(imageUri: string, userId: string, pathName: string) {
  try {
    const bodyFormData = new FormData();
    const fileName = imageUri.substring(
      imageUri.lastIndexOf('/') + 1,
      imageUri.length,
    );
    console.log(imageUri);
    bodyFormData.append('image', {
      uri: imageUri,
      type: `image/${fileName.substring(
        fileName.lastIndexOf('.') + 1,
        fileName.length,
      )}`,
      name: `${fileName}`,
    });
    bodyFormData.append('userId', userId);
    bodyFormData.append('pathName', pathName);
    console.log(bodyFormData.getAll());
    const res = await axios.post('file-upload/single', bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

const UploadService = {
  uploadImage,
};

export default UploadService;

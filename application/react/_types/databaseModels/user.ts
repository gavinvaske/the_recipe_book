import { MongooseAttributes } from "./_sharedMongooseAttributes";

export type User = MongooseAttributes & {
  email: string;
  userType: 'ADMIN' | 'USER',
  profilePicture?: ProfilePicture,
  username?: string,
  fullName?: string,
  jobRole?: string,
  phoneNumber?: string,
  birthDate?: Date
}

type ProfilePicture = {
  data: {
    type: Buffer
  },
  contentType: 'image/png' | 'image/jpeg' | 'image/jpg'
}


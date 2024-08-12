import { MongooseAttributes } from "./_sharedMongooseAttributes";

export type User = MongooseAttributes & {
  email: string;
  profilePicture?: ProfilePicture,
  username?: string,
  fullName?: string,
  jobRole?: string,
  phoneNumber?: string,
  birthDate?: Date,
  authRoles: 'ADMIN' | 'USER',
}

type ProfilePicture = {
  data: {
    type: Buffer
  },
  contentType: 'image/png' | 'image/jpeg' | 'image/jpg'
}


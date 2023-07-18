type UserState = {
  isAuthenticated: boolean;
  authToken: string | null;
  userId: string | null;
};

type SetUserPayload = {
  authToken: string;
};

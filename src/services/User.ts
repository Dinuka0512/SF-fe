import api from "./api"

// Refresh Token
export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/user/refresh-token", {
    refreshToken,
  });

  return res.data; // { accessToken }
};

// Register
export const registerUser = (data: {
  fristName: string;
  lastName: string;
  email: string;
  password: string;
  conformPassword: string;
  role: string;
}) => {
  return api.post("/user/register", data);
};

// Login
export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/user/login", data);
};

// Send OTP
export const sendOtp = (email: string) => {
  return api.post("/user/otpGenarate", { email });
};

// Verify OTP
export const verifyOtp = (data: {
  email: string;
  otp: string;
}) => {
  return api.post("/user/checkOtp", data);
};

// Change Password
export const changePassword = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/user/changePassword", data);
};

export const getUserRole = (data:{email:string})=>{
  return api.get("/user/getRole", {
    params: { email: data.email }
  });
};

export const getMyDetails = async()=>{
  const res = await api.get("/user/me")
  return res.data
};

export const updateUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
}) => {
  const res = await api.post("/user/update", data);
  return res.data;
};

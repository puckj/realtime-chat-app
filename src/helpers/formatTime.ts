export const formatTime = (time) => {
  const options = { hour: "numeric", minute: "numeric" };
  return new Date(time).toLocaleString("en-US", options);
};

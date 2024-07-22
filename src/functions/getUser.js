exports.index = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Get User!",
    }),
  };
};

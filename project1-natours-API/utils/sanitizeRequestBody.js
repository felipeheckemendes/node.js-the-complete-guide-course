const sanitizeBody = (body, allowedFields) => {
  const sanitizedBody = {};
  Object.keys(body).forEach((key) => {
    if (allowedFields.includes(key)) {
      sanitizedBody[key] = body[key];
    }
  });
  return sanitizedBody;
};

module.exports = (allowedFields) => (req, res, next) => {
  req.body = sanitizeBody(req.body, allowedFields);
  next();
};

// src/middlewares/validate.js

import { validationResult } from 'express-validator';

const handleValidation = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array().map(e => ({ param: e.param, msg: e.msg })) });
  }
  next();
};

export default handleValidation
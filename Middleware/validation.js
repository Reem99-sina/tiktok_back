const schematype = ["body", "params", "query", "file", "headers"];
module.exports.validation = (schema) => {
  return (req, res, next) => {
    try {
      const validateArr = [];
      schematype.forEach((key) => {
        if (schema[key]) {
          const resultValid = schema[key].validate(req[key], {
            abortEarly: false,
          });
          if (resultValid.error) {
            validateArr.push(resultValid.error.details);
          }
        }
      });
      if (validateArr.length > 0) {
        res.status(400).json({ message: "validation error", validateArr });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({ message: "catch error", error });
    }
  };
};

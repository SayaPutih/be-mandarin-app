export const validateTeacher = (req, res, next) => {
  if (req.user.role !== "TEACHER" && req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  next();
};

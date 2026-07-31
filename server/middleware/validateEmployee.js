const validateEmployee = (req, res, next) => {
  const {
    empId,
    name,
    email,
    mobile,
    wwid,
    position,
  } = req.body;

  if (!empId)
    return res.status(400).json({
      success: false,
      message: "Employee ID is required",
    });

  if (!name)
    return res.status(400).json({
      success: false,
      message: "Employee Name is required",
    });

  if (!email)
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });

  // if (!mobile)
  //   return res.status(400).json({
  //     success: false,
  //     message: "Mobile Number is required",
  //   });

  // if (!wwid)
  //   return res.status(400).json({
  //     success: false,
  //     message: "WWID is required",
  //   });

  if (!position)
    return res.status(400).json({
      success: false,
      message: "Position is required",
    });

  next();
};

module.exports = validateEmployee;
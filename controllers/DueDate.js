const Fees = require('../models/Fees.js');

exports.updateDueDate = async (req, res) => {
    const { enrollmentId } = req.params;
    const { dueDate } = req.body;

try {
    // Check if the enrollmentId exists in the Fees model
    const feeRecord = await Fees.findOne({ where: { enrollmentId } });

    if (!feeRecord) {
      // If the enrollment ID is not found, return a 404 response
      return res.status(404).json({
        message: "Enrollment ID not found in Fees model",
        enrollmentId,
      });
    }

    // Update the due date in the Fees model
    await Fees.update(
      { duedate: dueDate }, // Set the new dueDate
      { where: { enrollmentId } } // Update where enrollmentId matches
    );

    // Send a success response
    return res.status(200).json({
      message: "Due date updated successfully",
      enrollmentId,
      dueDate,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error updating due date:", error);
    return res.status(500).json({
      message: "An error occurred while updating the due date",
      error: error.message,
    });
  }


 };






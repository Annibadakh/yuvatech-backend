const express = require('express');
const StudyMaterial = require("../models/StudyMaterialModel.js");
const { upload } = require("../middleware/FileUpload.js"); // Import the upload middleware from FileUpload.js
const Course = require("../models/CourseModel.js");
const fs = require("fs");
const path = require("path");

// Upload a study material
exports.uploadStudyMaterial = (req, res) => {
  // Calling Multer middleware to handle file upload
  upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if the user is authorized to upload to this course
    Course.findByPk(req.body.courseId)
      .then((course) => {
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        // if (req.user.role !== 'admin' && course.createdBy !== req.user.uuid) {
        //     return res.status(403).json({ message: "Unauthorized: You can only upload materials to courses you've created" });
        // }

        // If file is uploaded, save information to database
        StudyMaterial.create({
          courseId: req.body.courseId,
          title: req.body.title,
          fileUrl: req.file.path,
          description:req.body.description
        })
          .then((material) => {
            res.status(201).json({
              message: "File uploaded successfully",
              material,
            });
          })
          .catch((error) => {
            res
              .status(500)
              .json({ message: "Failed to save file info", error });
          });
      })
      .catch((error) => {
        console.error("Error retrieving course: ", error); // Log the full error
        res
          .status(500)
          .json({
            message: "Failed to retrieve course information",
            error: error.message || error,
          });
      });
  });
};
// exports.updateStudyMaterial = (req, res) => {
//   // Calling Multer middleware to handle file upload
//   upload.single("file")(req, res, function (err) {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Check if the study material exists
//     StudyMaterial.findByPk(req.params.materialId)
//       .then((material) => {
//         if (!material) {
//           return res.status(404).json({ message: "Study material not found" });
//         }

//         // Update study material information
//         material.title = req.body.title;
//         // material.fileUrl = req.file.path;
//         material.description=req.body.description;
//         // Save the updated study material
//         material
//           .save()
//           .then((updatedMaterial) => {
//             res.status(200).json({
//               message: "Study material updated successfully",
//               material: updatedMaterial,
//             });
//           })
//           .catch((error) => {
//             res.status(500).json({
//               message: "Failed to update study material",
//               error: error.message || error,
//             });
//           });
//       })
//       .catch((error) => {
//         console.error("Error retrieving study material: ", error);
//         res.status(500).json({
//           message: "Failed to retrieve study material information",
//           error: error.message || error,
//         });
//       });
//   });
// };

exports.updateStudyMaterial = (req, res) => {
  // Calling Multer middleware to handle file upload
  upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    // Check if the study material exists
    StudyMaterial.findByPk(req.params.materialId)
      .then((material) => {
        if (!material) {
          return res.status(404).json({ message: "Study material not found" });
        }

        // Update study material information
        material.title = req.body.title;
        material.description = req.body.description;

        // Update fileUrl if a new file is uploaded
        if (req.file) {
          material.fileUrl = req.file.path;
        }

        // Save the updated study material
        material
          .save()
          .then((updatedMaterial) => {
            res.status(200).json({
              message: "Study material updated successfully",
              material: updatedMaterial,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Failed to update study material",
              error: error.message || error,
            });
          });
      })
      .catch((error) => {
        console.error("Error retrieving study material: ", error);
        res.status(500).json({
          message: "Failed to retrieve study material information",
          error: error.message || error,
        });
      });
  });
};

exports.getStudyMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.materialId);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    res.status(200).json(material);
  } catch (error) {
    console.error("Error retrieving study material:", error);
    res.status(500).json({ message: "Failed to retrieve study material", error: error.message || error });
  }
};

exports.showStudyMaterial = (req, res) => {
  const { materialId } = req.params;

  // Find the study material by its materialId
  StudyMaterial.findByPk(materialId)
    .then((material) => {
      if (!material) {
        return res.status(404).json({ message: "Study material not found" });
      }
      
      const filePath = material.fileUrl; // Assuming fileUrl contains the path of the PDF file
      
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Read the file content
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ message: "Failed to read document" });
        }
        // Set appropriate content type for PDF
        res.setHeader("Content-Type", "application/pdf");
        // Send the file content as a response
        res.send(data);
      });
    })
    .catch((error) => {
      console.error("Error retrieving study material:", error);
      res.status(500).json({ message: "Failed to retrieve study material", error });
    });
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case ".pdf":
        return "application/pdf";
      case ".doc":
      case ".docx":
        return "application/msword";
      // Add more content types as needed
      default:
        return "application/octet-stream";
    }
  }

// Get study materials by course
exports.getStudyMaterialsByCourse = (req, res) => {
  const { courseId } = req.params;
  StudyMaterial.findAll({
    where: { courseId: courseId },
  })
    .then((materials) => {
      if (materials.length > 0) {
        res.status(200).json(materials);
      } else {
        res.status(404).json({ message: "No materials found for this course" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Failed to retrieve study materials", error });
    });
};


exports.deleteStudyMaterial = (req, res) => {
  const materialId = req.params.materialId;

  // Find and delete the study material from the database
  StudyMaterial.findOne({ where: { materialId: materialId } })
    .then((studyMaterial) => {
      if (!studyMaterial) {
        return res.status(404).json({ message: "Study material not found" });
      }
      
      // Delete the file from the upload folder
      const filePath = path.join(process.cwd(), studyMaterial.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          // Even if there's an error deleting the file, continue to delete the database record
        }
        
        // Delete the study material record from the database
        studyMaterial.destroy()
          .then(() => {
            res.status(200).json({ message: "Study material and file deleted successfully" });
          })
          .catch((error) => {
            res.status(500).json({ message: "Failed to delete study material", error });
          });
      });
    })
    .catch((error) => {
      console.error("Error finding study material:", error);
      res.status(500).json({ message: "Failed to find study material", error });
    });
};

const express = require("express");
const {
  trackInfoWrapper,
  getTrackingNumber,
} = require("../controllers/trackController");

const router = express.Router();

// Define a function to refine the trackingInfo object
function refineTrackingInfo(trackingInfo, orderNumber) {
  // Make a deep copy of the trackingInfo object to avoid modifying the original
  const refinedInfo = JSON.parse(JSON.stringify(trackingInfo));

  // Add the orderNumber field to the first element in the data array
  refinedInfo.data[0].order_number = orderNumber;

  return refinedInfo;
}

router.post("/track", async (req, res) => {
  const orderNumber = req.body.orderNumber;
  try {
    if (orderNumber) {
      console.log(`Order ${orderNumber} has been received`);
      const trackNumber = getTrackingNumber(orderNumber);

      if (!trackNumber) {
        throw new Error("Tracking number not found");
      }

      console.log(`Tracking number for order ${orderNumber} is ${trackNumber}`);
      const trackingInfo = await trackInfoWrapper(trackNumber); // Corrected: Use await to wait for the promise to resolve

      // Refine the trackingInfo object
      const refinedTrackingInfo = refineTrackingInfo(trackingInfo, orderNumber);

      // Send the refined trackingInfo as the response
      res.status(200).json(refinedTrackingInfo);
    } else {
      throw new Error("Order number is required");
    }
  } catch (error) {
    // Handle errors and return an error response
    res.status(400).json({
      status: {
        code: 400,
        message: error.message,
      },
    });
  }
});

module.exports = router;
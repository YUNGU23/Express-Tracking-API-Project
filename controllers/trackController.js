const axios = require('axios');

// Function to fetch tracking information for an order
module.exports.trackInfoWrapper = async (orderNumber) => {
    try {
        console.log("Trying to get track info from upstream API");
        const trackingMoreAPIKey = process.env.TRACKINGMORE_API_KEY;

        // Detect the courier for the order
        const courierCode = await detectCourier(orderNumber, trackingMoreAPIKey);

        if (!courierCode) {
            console.log("Courier not detected");
            throw new Error('Courier not detected');
        }

        // Create a tracking event for the order
        await createTrackingEvent(orderNumber, courierCode, trackingMoreAPIKey);

        // Fetch tracking information
        const trackingMoreResponse = await fetchTrackingInfo(orderNumber, trackingMoreAPIKey);

        return trackingMoreResponse;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Sample order information
const info = [
    {
        orderNumber: "113-9037653-6183406",
        trackingNumber: "TBA309425839591",
    },
    {
        orderNumber: "14-09597-06210",
        trackingNumber: "93001902273656566017346434",
    },
    {
        orderNumber: "04-10144-80286",
        trackingNumber: "772354242262",
    }, 
    {
        orderNumber: "123456789",
        trackingNumber: "123456789",
    }, 
    {
        orderNumber: "9104223295",
        trackingNumber: "9104223295",
    },
    {
        orderNumber: "TBA309367834145",
        trackingNumber: "TBA309367834145",
    }
];

// Function to get the tracking number for an order
module.exports.getTrackingNumber = (orderNumber) => {
    console.log(`Trying to get tracking number for order ${orderNumber}`);
    const order = info.find((o) => o.orderNumber === orderNumber);

    if (order) {
        return order.trackingNumber;
    }

    return null;
};

// Function to detect the courier for an order
async function detectCourier(orderNumber, apiKey) {
    const detectApiUrl = 'https://api.trackingmore.com/v3/trackings/detect';
    const detectRequestData = {
        tracking_number: orderNumber,
    };
    const trackingMoreHeaders = getTrackingMoreHeaders(apiKey);

    try {
        const courierDetected = await axios.post(detectApiUrl, detectRequestData, { headers: trackingMoreHeaders });

        // Check if a courier was detected
        if (courierDetected?.data?.data?.length === 0) {
            return null;
        }

        // Return the detected courier code
        return courierDetected.data.data[0].courier_code;
    } catch (error) {
        throw new Error('Error detecting courier');
    }
}

// Function to create a tracking event for an order
async function createTrackingEvent(orderNumber, courierCode, apiKey) {
    const createTrackApiUrl = 'https://api.trackingmore.com/v4/trackings/create';
    const createTrackRequestData = {
        tracking_number: orderNumber,
        courier_code: courierCode,
    };
    const trackingMoreHeaders = getTrackingMoreHeaders(apiKey);

    try {
        await axios.post(createTrackApiUrl, createTrackRequestData, { headers: trackingMoreHeaders });
    } catch (error) {
        console.log("Ignoring if the tracking event already exists.");
    }
}

// Function to fetch tracking information from the API
async function fetchTrackingInfo(orderNumber, apiKey) {
    const trackingMoreApiUrl = `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${orderNumber}`;
    const trackingMoreHeaders = getTrackingMoreHeaders(apiKey);

    try {
        const trackingMoreResponse = await axios.get(trackingMoreApiUrl, { headers: trackingMoreHeaders });
        return trackingMoreResponse.data;
    } catch (error) {
        throw new Error('Error fetching tracking information');
    }
}

// Function to get the headers for API requests
function getTrackingMoreHeaders(apiKey) {
    return {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json',
    };
}
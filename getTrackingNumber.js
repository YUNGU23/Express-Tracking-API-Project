const info = [
    {
        orderNumber: "ORDER123",
        trackingNumber: "TRACK123",
    },
    {
        orderNumber: "ORDER456",
        trackingNumber: "TRACK456",
    },
    {
        orderNumber: "ORDER789",
        trackingNumber: "TRACK789",
    },
    {
        orderNumber: "ORDER987",
        trackingNumber: "TRACK987",
    },
    {
        orderNumber: "ORDER654",
        trackingNumber: "TRACK654",
    },
];

const getTrackingNumber = (orderNumber) => {
    const result = info.find((item) => item.orderNumber === orderNumber);
    if (result) {
        return result.trackingNumber;
    }
    return null;
};

module.exports = getTrackingNumber;

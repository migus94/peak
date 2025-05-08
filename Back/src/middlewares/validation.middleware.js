function requiredFields(fields) {
    return (req, res, next) => {
        const missingFields = fields.filter(field => req.body[field] == null);
        if (missingFields.length) {
            return res.status(400).json({
                error: `Campos faltantes: ${missingFields.join(', ')}`
            });
        };
        next();
    };
};

module.exports = { requiredFields };
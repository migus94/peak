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

function validateInt(paramName) {
    return (req, res, next) => {
        const value = req.params[paramName];
        const number = Number(value);
        if (!Number.isInteger(number) || number <= 0) {
            return res.status(400).json({ message: `Formato de ${paramName} no valido` });
        }
        req.params[paramName] = number;
        next();
    };
};

module.exports = { requiredFields, validateInt };
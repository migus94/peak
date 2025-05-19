const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token faltante' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.userId = payload.sub;
        const roles = payload.roles;
        req.userRoles = Array.isArray(roles)
            ? roles
            : roles
                ? [roles]
                : [];
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token no valido' });
    }
}

function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.userRoles.length) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        const hasRole = req.userRoles.some(x => allowedRoles.includes(x));
        if (!hasRole) {
            return res.status(403).json({ error: 'Rol no autorizado' });
        }
        next();
    }
}

module.exports = { authenticate, authorize }
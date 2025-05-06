const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers.autorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token faltante' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        req.userRoles = payload.roles || [];
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token no valido' });
    }
}

function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.userRoles) {
            return res.status(403).json({ error: 'No autenticado' });
        }
        const hasRole = req.userRoles.some(x => allowedRoles.includes(x));
        if (!hasRole) {
            return res.status(403).json({ error: 'Rol no permitido' });
        }
        next();
    }
}

module.exports = { authenticate, authorize }
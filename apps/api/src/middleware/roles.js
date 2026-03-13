/**
 * Middleware factory that accepts an array of allowed roles.
 * Must be used AFTER the `auth` middleware.
 *
 * @param {string[]} allowedRoles - e.g. ["ADMIN", "FACULTY"]
 */
export function roles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: no user attached to request" })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        required: allowedRoles,
        current: req.user.role
      })
    }

    next()
  }
}

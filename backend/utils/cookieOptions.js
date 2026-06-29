const isProd = process.env.NODE_ENV === "production";

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  ...(maxAge != null && { maxAge: Number(maxAge) }),
});

module.exports = { getCookieOptions, isProd };

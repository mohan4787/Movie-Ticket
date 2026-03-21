require("dotenv").config()

const AppConfig = {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    jwtSecret: process.env.JWT_SECRET
}

const SMTPConfig = {
    provider: process.env.SMTP_PROVIDER,
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.STMP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM
}

const DbConfig = {
  mongoDBUrl: process.env.MONGODB_URL,
  mongoDBName: process.env.MONGODB_DBNAME,
}

module.exports = {
    AppConfig,
    SMTPConfig,
    DbConfig
}
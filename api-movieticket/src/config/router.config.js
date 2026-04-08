const authRouter = require("../modules/auth/auth.router")
const bannerRouter = require("../modules/banner/banner.router")
const bookingRouter = require("../modules/booking/booking.router")
const movieRouter = require("../modules/movie/movie.router")
const showtimeRouter = require("../modules/showtime/showtime.router")
const upcomingMovieRouter = require("../modules/upcomingmovie/upcomingmovie.router")
const ticketRouter = require("../modules/ticket/ticket.router");
const orderRouter = require("../modules/order/order.router")

const router = require("express").Router()


router.get("/", (req,res, next) => {
    res.json({
        data: null,
        message: "Health ok",
        status: "Success",
        options: null
    })
})

router.use("/auth",authRouter)
router.use("/banner",bannerRouter)
router.use("/movie", movieRouter)
router.use("/showtime",showtimeRouter)
router.use("/upcomingmovie",upcomingMovieRouter)
router.use("/booking", bookingRouter)
router.use("/order",orderRouter)
router.use("/ticket",ticketRouter);

module.exports = router
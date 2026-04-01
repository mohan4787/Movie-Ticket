const { USER_ROLES } = require("../../config/constants");
const auth = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/request-validate.middleware");
const showtimeCtrl = require("./showtime.controller");
const {
  ShowTimeCreateDTO,
  ShowTimeUpdateDTO,
} = require("./showtime.validator");

const showtimeRouter = require("express").Router();

showtimeRouter
  .route("/")
  .post(
    auth([USER_ROLES.ADMIN]),
    bodyValidator(ShowTimeCreateDTO),
    showtimeCtrl.createShowTime,
  )
  .get(showtimeCtrl.listAllShowTimes);

showtimeRouter
  .route("/:movieId")
  .get(showtimeCtrl.getAllShowTimeByMovieId)
  .put(
    auth([USER_ROLES.ADMIN]),
    bodyValidator(ShowTimeUpdateDTO),
    showtimeCtrl.updateShowTimeById,
  )
  .delete(auth([USER_ROLES.ADMIN]), showtimeCtrl.deleteShowTimeById);

showtimeRouter.route("/movie/:movieId").get(showtimeCtrl.getShowTimesByMovie);
showtimeRouter.route("/date/:date").get(showtimeCtrl.getShowTimesByDate);

module.exports = showtimeRouter;

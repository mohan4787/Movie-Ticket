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
showtimeRouter.route("/getshowtime/:showtimeId").get(showtimeCtrl.getShowTimesByShowTimeId);
showtimeRouter.route("/date/:date").get(showtimeCtrl.getShowTimesByDate);


// showtimeRouter.post("/",bodyValidator(ShowTimeCreateDTO), showtimeCtrl.createShowTime);
// showtimeRouter.get("/", showtimeCtrl.listAllShowTimes);
// showtimeRouter.get("/movie/:movieId", showtimeCtrl.getAllShowTimeByMovieId);
// showtimeRouter.get("/:showtimeId", showtimeCtrl.getShowTimeById);
// showtimeRouter.put("/:showtimeId",  bodyValidator(ShowTimeUpdateDTO), showtimeCtrl.updateShowTimeById);
// showtimeRouter.delete("/:showtimeId", showtimeCtrl.deleteShowTimeById);
// showtimeRouter.get("/movie/:movieId", showtimeCtrl.getShowTimesByMovie);
// showtimeRouter.get("/date/:date", showtimeCtrl.getShowTimesByDate);

module.exports = showtimeRouter;

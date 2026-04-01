const ShowTimeModel = require("./showtime.model");
const showtimeSvc = require("./showtime.service");

class ShowTimeController {
  async createShowTime(req, res, next) {
    try {
      const payload = await showtimeSvc.transformShowTimeCreateData(req);
      const showtime = await showtimeSvc.create(payload);

      res.json({
        data: showtime,
        message: "ShowTime created successfully",
        status: "SHOWTIME_CREATED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async listAllShowTimes(req, res, next) {
    try {
      let filter = {};
      if (req.query.movie) {
        filter.movie = req.query.movie;
      }
      if (req.query.date) {
        filter.date = new Date(req.query.date);
      }
      if (req.query.status) {
        filter.status = req.query.status;
      }

      const { data, pagination } = await showtimeSvc.listAllRowsByFilter(
        req.query,
        filter
      );

      res.json({
        data,
        message: "ShowTime list fetched successfully",
        status: "SHOWTIME_LIST_FETCHED",
        options: { pagination },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getShowTimeById(req, res) {
    try {
      const showtime = await showtimeSvc.getSingleRowByFilter({
        _id: req.params.showtimeId,
      });

      if (!showtime) {
        return res.status(404).json({
          data: null,
          message: "ShowTime not found",
          status: "SHOWTIME_NOT_FOUND",
          options: null,
        });
      }

      res.json({
        data: showtime,
        message: "ShowTime details fetched",
        status: "SHOWTIME_DETAILS_FETCHED",
        options: null,
      });
    } catch (exception) {
     throw(exception)
    }
  }

  async updateShowTimeById(req, res, next) {
    try {
      const oldShowTime = await showtimeSvc.getSingleRowByFilter({
        _id: req.params.showtimeId,
      });

      const payload = await showtimeSvc.transformUpdateShowTimeData(
        req,
        oldShowTime
      );

      const update = await showtimeSvc.updateSingleRowByFilter(
        { _id: req.params.showtimeId },
        payload
      );

      res.json({
        data: update,
        message: "ShowTime updated successfully",
        status: "SHOWTIME_UPDATED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async deleteShowTimeById(req, res, next) {
    try {
      const deleted = await showtimeSvc.deleteSingleRowByFilter({
        _id: req.params.showtimeId,
      });

      res.json({
        data: deleted,
        message: "ShowTime deleted successfully",
        status: "SHOWTIME_DELETED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getShowTimesByMovie(req, res, next) {
    try {
      const showtimes = await showtimeSvc.listAllRowsByFilter({
        movie: req.params.movieId,
        status: "active",
      });

      res.json({
        data: showtimes.data,
        message: "ShowTimes fetched for movie",
        status: "SHOWTIME_BY_MOVIE_FETCHED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getShowTimesByDate(req, res, next) {
    try {
      const date = new Date(req.params.date);
      const showtimes = await showtimeSvc.listAllRowsByFilter({
        date: date,
        status: "active",
      });

      res.json({
        data: showtimes.data,
        message: "ShowTimes fetched for date",
        status: "SHOWTIME_BY_DATE_FETCHED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }

 async getAllShowTimeByMovieId(req, res, next) {
    try {
        const movieId = req.params.movieId;
        const getAllShowTime = await ShowTimeModel.find({ movieId: movieId });

        // The Frontend EXPECTS 'options.pagination'
        res.json({
            data: getAllShowTime,
            message: "Fetched all data successfully!!",
            status: "SHOWTIME_LIST_FETCHED",
            options: {
                pagination: {
                    current: 1,
                    limit: getAllShowTime.length,
                    total: getAllShowTime.length
                }
            }
        });
    } catch (exception) {
        next(exception);
    }
}
}

const showtimeCtrl = new ShowTimeController();
module.exports = showtimeCtrl;
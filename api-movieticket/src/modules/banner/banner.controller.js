const bannerSvc = require("./banner.service");

class BannerController {
  #bannerDetail;
  async createBanner(req, res, next) {
    try {
      const payload = await bannerSvc.transformBannerCreateData(req);
      const banner = await bannerSvc.create(payload);
      res.json({
        data: banner,
        message: "Banner created successfully",
        status: "success",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }
  async listAllBanners(req, res, next) {
    try {
      let filter = {};
      if (req.query.search) {
        filter = {
          ...filter,
          // title: new RegExp(req.query.search, "i"),
          title: { [Option.iLink]: `%${req.query.search}%` },
        };
      }
      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }
      const { data, pagination } = await bannerSvc.listAllRowsByFilter(
        req.query,
        filter,
      );
      res.json({
        data: data,
        message: "Banner list fetched successfully",
        status: "BANNER_LIST_FETCHED",
        options: { pagination },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async #getBannerDetail(bannerId) {
    this.#bannerDetail = await bannerSvc.getSingleRowByFilter({
      _id: bannerId,
    });
    if (!this.#bannerDetail) {
      throw {
        code: 422,
        message: "Banner not found",
        status: "BANNER_NOT_FOUND",
      };
    }
  }

  // async getBannerDetailsById(req, res, next) {
  //   try {
  //     await this.#getBannerDetail(req.params.bannerId);
  //     res.json({
  //       data: this.#bannerDetail,
  //       message: "Banner details fetched successfully",
  //       status: "BANNER_DETAILS_FETCHED",
  //       options: null,
  //     });
  //   } catch (exception) {
  //     next(exception);
  //   }
  // }

  getBannerDetailsById = async (req, res) => {
    try {
      const id = req.params.bannerId;
      const getData = await bannerSvc.getDetail(id);

      res.json({
        data: getData,
        status: "Sucess",
        detail: "Banner Found!!",
      });
    } catch (exception) {
      throw exception;
    }
  };

  updateBannerById = async (req, res, next) => {
  try {
    const bannerId = req.params.bannerId;

    // Fetch the banner
    const banner = await bannerSvc.getSingleRowByFilter({ _id: bannerId });

    if (!banner) {
      return res.status(404).json({
        error: null,
        message: "Banner not found",
        status: "BANNER_NOT_FOUND",
        options: null,
      });
    }

    // Transform the update data (handles uploaded image if present)
    const payload = await bannerSvc.transformUpdateBannerData(req, banner);

    // Update the banner in DB
    const update = await bannerSvc.updateSingleRowByFilter(
      { _id: banner._id },
      payload
    );

    res.json({
      data: update,
      message: "Banner updated successfully",
      status: "BANNER_UPDATED",
      options: null,
    });
  } catch (exception) {
    next(exception);
  }
};
  async deleteBannerById(req, res, next) {
    try {
      const bannerId = req.params.bannerId;

      const banner = await bannerSvc.getSingleRowByFilter({ _id: bannerId });
      if (!banner) {
        return res.status(404).json({
          error: null,
          message: "Banner not found",
          status: "BANNER_NOT_FOUND",
          options: null,
        });
      }

      const deleteRow = await bannerSvc.deleteSingleRowByFilter({
        _id: bannerId,
      });
      res.json({
        data: deleteRow,
        message: "Banner deleted successfully",
        status: "BANNER_DELETED",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }
}

const bannerCtrl = new BannerController();
module.exports = bannerCtrl;

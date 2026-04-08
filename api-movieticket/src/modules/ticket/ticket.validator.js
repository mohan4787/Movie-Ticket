const Joi = require("joi");

const TicketVerifyDTO = Joi.object({
  qrToken: Joi.string().required(),
});


const TicketGetUserDTO = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});

const TicketUpdateDTO = Joi.object({
  status: Joi.string().valid("valid", "used").required(),
});


const TicketCreateDTO = Joi.object({
  bookingId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  seatNumber: Joi.string().required(),
});

module.exports = {
  TicketVerifyDTO,
  TicketGetUserDTO,
  TicketUpdateDTO,
  TicketCreateDTO,
};
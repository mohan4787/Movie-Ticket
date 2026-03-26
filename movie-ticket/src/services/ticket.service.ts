import BaseService from "./base.service";

class TicketService extends BaseService {
  url = "/ticket";

  generate(bookingId: string) {
    return this.postRequest(`${this.url}/generate`, { bookingId });
  }

  verify(qrToken: string) {
    return this.postRequest(`${this.url}/verify`, { qrToken });
  }
}

export default new TicketService();
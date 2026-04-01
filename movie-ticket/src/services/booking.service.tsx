import BaseService from "./base.service";

interface BookingFilter {
  status?: "reserved" | "confirmed" | "cancelled";
  userId?: string;
  date?: string;
}

class BookingService extends BaseService {
  private baseUrl = "/api/bookings";

  async getAll(filters?: BookingFilter) {
    return this.getRequest(this.baseUrl, { params: filters });
  }

  async getById(id: string) {
    return this.getRequest(`${this.baseUrl}/${id}`);
  }

  async confirmBooking(bookingId: string) {
    return this.postRequest(`${this.baseUrl}/confirm`, { bookingId });
  }

  async cancelBooking(bookingId: string) {
    return this.postRequest(`${this.baseUrl}/cancel`, { bookingId });
  }
}

export default new BookingService();
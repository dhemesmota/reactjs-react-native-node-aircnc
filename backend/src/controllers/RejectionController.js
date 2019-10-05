const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');

        if (booking.approved) {
            return res.json({ message: 'Reserva já aprovada, não pode mais ser rejeitada.' });
        }

        booking.approved = false;

        await booking.save();

        const bookingUserSocket = req.connectedUsers[booking.user];

        if(bookingUserSocket) {
            req.io.to(bookingUserSocket).emit('booking_response', booking);
        }

        return res.json(booking);
    }
}
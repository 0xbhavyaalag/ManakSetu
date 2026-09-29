import React, { useState } from 'react';
import { X, Calendar, Clock, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Booking, Slot } from '../types';
import { api } from '../services/api';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onRescheduleSuccess: (updated: Booking) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onRescheduleSuccess
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('25 September');
  const [reason, setReason] = useState<string>('Weather / Harvest ready early');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [centreSlots, setCentreSlots] = useState<any[]>([]);

  React.useEffect(() => {
    if (booking?.centre_id) {
      api.getCentre(booking.centre_id)
        .then((c) => {
          if (c && c.slots && c.slots.length > 0) {
            setCentreSlots(c.slots);
            const activeSlots = c.slots.filter((s: any) => s.is_active && s.id !== booking.slot_id);
            if (activeSlots.length > 0) {
              setSelectedSlotId(activeSlots[0].id);
            }
          }
        })
        .catch(() => {});
    }
  }, [booking?.centre_id, booking?.slot_id]);

  if (!isOpen || !booking) return null;

  // Real or structured fallback slots matching centre ID
  const availableSlots = (centreSlots.length > 0
    ? centreSlots.filter((s: any) => s.is_active)
    : [
        { id: (booking?.centre_id === 2 ? 16 : 6), time_slot: '10:00 AM', time: '10:00 AM', capacity_tokens: 20, booked_tokens: 5, available: 15 },
        { id: (booking?.centre_id === 2 ? 17 : 7), time_slot: '11:00 AM', time: '11:00 AM', capacity_tokens: 20, booked_tokens: 8, available: 12 },
        { id: (booking?.centre_id === 2 ? 18 : 8), time_slot: '12:00 PM', time: '12:00 PM', capacity_tokens: 20, booked_tokens: 12, available: 8 },
        { id: (booking?.centre_id === 2 ? 19 : 9), time_slot: '02:00 PM', time: '02:00 PM', capacity_tokens: 20, booked_tokens: 6, available: 14 },
        { id: (booking?.centre_id === 2 ? 20 : 10), time_slot: '03:00 PM', time: '03:00 PM', capacity_tokens: 20, booked_tokens: 9, available: 11 },
      ]
  ).map((s: any) => ({
    id: s.id,
    time: s.time_slot || s.time || '11:00 AM',
    available: Math.max(1, (s.capacity_tokens || 20) - (s.booked_tokens || 0))
  }));

  const handleConfirmReschedule = async () => {
    const slotIdToSubmit = selectedSlotId || availableSlots[0]?.id || 11;

    setLoading(true);
    setError(null);

    try {
      const res = await api.rescheduleBooking(booking.id, {
        new_slot_id: slotIdToSubmit,
        new_date: selectedDate,
        reason: reason
      });
      setSuccess(true);
      setTimeout(() => {
        onRescheduleSuccess(res);
        onClose();
        setSuccess(false);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule. Please try another slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Dynamic Slot Rescheduling
              </h3>
              <p className="text-xs text-slate-500">
                Instantly releases your current slot and re-allocates priority queue
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 space-y-4">
          
          {/* Current Booking Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CURRENT BOOKING
              </span>
              <div className="font-extrabold text-sm text-slate-800">
                {booking.booking_code} ({booking.crop_name} - {booking.quantity_quintals}q)
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {booking.centre_name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">
                {booking.booking_date} • {booking.booking_time}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                Token: {booking.token_number}
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select New Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['24 September (Today)', '25 September (Tomorrow)'].map((d) => {
                const cleanDate = d.split(' ')[0] + ' ' + d.split(' ')[1];
                const isSel = selectedDate === cleanDate;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(cleanDate)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isSel 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Available Slots ({selectedDate})
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{slot.time}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {slot.available} slots left
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Rescheduling
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Harvest ready early">Harvest ready early</option>
              <option value="Tractor / Transport delayed">Tractor / Transport delayed</option>
              <option value="Weather / Rain forecast">Weather / Rain forecast</option>
              <option value="Farmer personal schedule">Farmer personal schedule</option>
            </select>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Booking successfully rescheduled! SMS alert sent.</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-reschedule"
            onClick={handleConfirmReschedule}
            disabled={loading}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>

      </div>
    </div>
  );
};

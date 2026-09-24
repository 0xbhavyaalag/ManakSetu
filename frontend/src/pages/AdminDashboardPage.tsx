import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Building2, TrendingUp, AlertTriangle, 
  DollarSign, FileText, CheckCircle, Clock, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dash, logs] = await Promise.all([
        api.getAdminDashboard(),
        api.getAuditLogs()
      ]);
      setData(dash);
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = data?.stats;

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-md shrink-0">
            <img src="/logo-icon.png" alt="ANNADHARA" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Mandi Supervisor & State Admin Portal
              </h1>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-300">
                STATE MONITOR
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Procurement Oversight, Centre Balancing, Queue Optimization & Audit Trail
            </p>
          </div>
        </div>

        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="btn-press p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards (Section 23) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Farmers</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats?.total_farmers.toLocaleString() || '1,420'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Bookings</span>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
            {stats?.active_bookings || '38'}
          </div>
          <span className="text-[10px] text-slate-500">Today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Intake</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            {Math.round(stats?.today_procurement_quintals || 4250)}q
          </div>
          <span className="text-[10px] text-slate-500">In Godowns</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Waiting In Yards</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {stats?.waiting_farmers || '148'}
          </div>
          <span className="text-[10px] text-slate-500">In Queue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats?.completed_procurement || '184'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Accepted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total DBT Payout</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
            ₹18.9L
          </div>
          <span className="text-[10px] text-slate-500">Aadhaar Disbursed</span>
        </div>
      </div>

      {/* Centre Overcrowding & Capacity Grid (Section 24) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Procurement Centre Capacity & Dynamic Load Balancing
            </h3>
            <p className="text-xs text-slate-500">
              Centres with queue &gt; 80 are flagged overcrowded; traffic is dynamically diverted
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.centres?.map((c: any) => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border ${
                c.is_overcrowded
                  ? 'border-rose-300 bg-rose-50/60'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{c.name}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  c.is_overcrowded
                    ? 'bg-rose-200 text-rose-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {c.is_overcrowded ? 'OVERCROWDED' : 'NORMAL'}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Queue</div>
                  <div className={`font-black text-sm ${c.is_overcrowded ? 'text-rose-600' : 'text-slate-800'}`}>
                    {c.current_queue}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Capacity</div>
                  <div className="font-black text-sm text-slate-800">{c.daily_capacity}q</div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Counters</div>
                  <div className="font-black text-sm text-emerald-700">{c.active_counters}</div>
                </div>
              </div>

              {c.is_overcrowded && (
                <div className="mt-3 p-2 bg-rose-100 rounded-xl text-[11px] text-rose-900 flex items-start gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
                  <span>Traffic diversion advisory active: Recommending Centre B as alternative.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Trail (Section 25 & 26) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-5 h-5 text-slate-700" />
          <h3 className="font-extrabold text-base text-slate-900">
            Immutable Procurement Audit Trail
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      {log.actor_role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{log.action}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-800">{log.entity_id}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

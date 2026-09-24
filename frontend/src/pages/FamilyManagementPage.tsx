import React, { useState } from 'react';
import { 
  Users, UserPlus, ShieldCheck, ShieldAlert, Smartphone, Phone, 
  Check, X, Edit2, AlertCircle, Info 
} from 'lucide-react';
import { Family, FamilyMember } from '../types';
import { api } from '../services/api';

interface FamilyManagementPageProps {
  family: Family | null;
  onRefreshFamily: () => void;
}

export const FamilyManagementPage: React.FC<FamilyManagementPageProps> = ({
  family,
  onRefreshFamily
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [phone, setPhone] = useState('');
  const [deviceType, setDeviceType] = useState<'smartphone' | 'keypad'>('smartphone');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleAuth = async (member: FamilyMember) => {
    if (!family) return;
    try {
      await api.updateFamilyMember(family.id, member.id, {
        is_authorized: !member.is_authorized
      });
      onRefreshFamily();
    } catch (e: any) {
      alert(e.message || 'Failed to update authorization.');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!family) return;
    if (!name || !phone) {
      setError('Name and mobile number are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.addFamilyMember(family.id, {
        name,
        relationship_to_head: relationship,
        phone,
        device_type: deviceType,
        is_authorized: isAuthorized
      });
      setShowAddModal(false);
      setName('');
      setPhone('');
      onRefreshFamily();
    } catch (err: any) {
      setError(err.message || 'Failed to add family member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Family Account & Representative Authorization
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-300">
              Family ID: {family?.family_code || 'F101'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage household members, devices (Keypad/Smartphone), and authorized procurement representatives
          </p>
        </div>

        <button
          id="btn-add-family-member"
          onClick={() => setShowAddModal(true)}
          className="btn-press px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Security Rule Alert (Section 11) */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Mandatory Verification Rule:</strong> A booking belongs to the registered farmer (Ramesh Kumar). An authorized family member may visit the centre, but only if marked as <strong>"Authorized Representative"</strong> here. Unauthorized persons will be rejected at gate biometric inspection.
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {family?.members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-800 flex items-center justify-center font-extrabold text-sm border border-emerald-200">
                  {member.name[0]}
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  member.is_authorized
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {member.is_authorized ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>AUTHORIZED</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3 h-3 text-slate-400" />
                      <span>UNAUTHORIZED</span>
                    </>
                  )}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-extrabold text-base text-slate-900">
                  {member.name}
                </h3>
                <div className="text-xs text-slate-500 font-medium">
                  {member.relationship_to_head} • Sub-user: <span className="font-mono text-emerald-800 font-bold">{member.sub_user_code}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Mobile:</span>
                  <span className="font-mono font-semibold">+91 {member.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Device Type:</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    {member.device_type === 'smartphone' ? (
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span className="capitalize">{member.device_type}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Aadhaar (KYC):</span>
                  <span className="font-mono text-[11px] text-slate-500">{member.aadhaar_masked}</span>
                </div>
              </div>
            </div>

            {/* Toggle Authorization Button */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleToggleAuth(member)}
                className={`btn-press w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  member.is_authorized
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {member.is_authorized ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Revoke Procurement Authorization</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Authorize as Representative</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add Sub-User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Add Sub-User to Family {family?.family_code || 'F101'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="my-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikas Kumar"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relationship to Head Farmer
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Brother">Brother</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Device Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeviceType('smartphone')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      deviceType === 'smartphone'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Smartphone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeviceType('keypad')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      deviceType === 'keypad'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Keypad Phone</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="auth-check"
                  checked={isAuthorized}
                  onChange={(e) => setIsAuthorized(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="auth-check" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Authorize this member to represent farmer during centre visits
                </label>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {loading ? 'Adding...' : 'Save Member'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

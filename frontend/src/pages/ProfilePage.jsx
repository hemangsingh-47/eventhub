import { useState, useContext } from 'react';
import { User, Mail, Shield, Award, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('auth/profile', { name, profileImage });
      setUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const isStudent = user.role === 'student';

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200 overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-[var(--color-border)]">
                  <Shield className="w-5 h-5 text-[var(--color-primary)]" fill="currentColor" fillOpacity={0.1}/>
                </div>
              </div>

              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{user.name}</h1>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-6 capitalize">{user.role}</p>
              
              <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            {isStudent && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Trophy className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider opacity-80">Campus Points</span>
                  </div>
                  <div className="text-4xl font-black mb-1">{user.points || 0}</div>
                  <p className="text-xs font-semibold opacity-70">Points earned from RSVPing and attending events</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Achievements & More */}
          <div className="lg:col-span-2 space-y-6">
            {isStudent ? (
              <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-card overflow-hidden">
                <div className="p-8 pb-4">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-indigo-500" />
                    Achievements & Badges
                  </h2>
                </div>
                
                <div className="p-8 pt-0">
                  {user.badges && user.badges.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {user.badges.map((badge, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:bg-white transition-all group">
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            🏅
                          </div>
                          <span className="text-xs font-bold text-center text-[var(--color-text-secondary)]">{badge}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 p-12 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-8 h-8 text-gray-200" />
                      </div>
                      <h3 className="text-sm font-bold text-[var(--color-text-secondary)]">No badges yet</h3>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1 mb-6">Start attending events to earn exclusive campus badges!</p>
                      <Link to="/" className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                        Discover Events
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-card p-8">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  Organizer Privileges
                </h2>
                <div className="space-y-4">
                  {[
                    "Create and manage campus events",
                    "Track seat utilization and analytics",
                    "Manage event attendees & exports",
                    "Real-time community engagement",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/30">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-sm font-semibold text-[var(--color-text-secondary)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Account Settings</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm font-bold text-[var(--color-primary)] hover:underline"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4 animate-premium-in">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[var(--color-primary)] focus:bg-white outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1.5 ml-1">Profile Image URL</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[var(--color-primary)] focus:bg-white outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-2xl text-sm font-bold hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="p-4 rounded-2xl border border-[var(--color-border)] text-left hover:border-[var(--color-primary)] transition-all group">
                    <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Security</div>
                    <div className="text-sm font-bold text-[var(--color-text-secondary)]">Update Password</div>
                  </button>
                  <button className="p-4 rounded-2xl border border-[var(--color-border)] text-left hover:border-[var(--color-primary)] transition-all group">
                    <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Preferences</div>
                    <div className="text-sm font-bold text-[var(--color-text-secondary)]">Discovery Settings</div>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

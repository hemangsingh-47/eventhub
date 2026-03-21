import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Shield, Award, Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const PublicProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`auth/profile/${id}`);
        setUser(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">User not found</h2>
        <Link to="/" className="text-[var(--color-primary)] hover:underline font-medium">Return to Home</Link>
      </div>
    );
  }

  const isStudent = user.role === 'student';
  const isSelf = currentUser && currentUser._id === user._id;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <Link to={-1} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
            {isSelf && (
                 <Link to="/profile" className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-muted)] px-3 py-1.5 rounded-lg border border-indigo-200/50 hover:bg-indigo-100 transition-colors">
                    Edit Your Profile
                 </Link>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
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
                {!isStudent && (
                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-[var(--color-border)]">
                      <Shield className="w-5 h-5 text-[var(--color-primary)]" fill="currentColor" fillOpacity={0.1}/>
                    </div>
                )}
              </div>

              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{user.name}</h1>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-6 capitalize">{user.role}</p>
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
                </div>
              </div>
            )}
          </div>

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
                        <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-gray-50 border border-gray-100 group">
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
                      <h3 className="text-sm font-bold text-[var(--color-text-secondary)]">No badges</h3>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1 mb-6">This user hasn't earned any badges yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
                <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-card p-12 text-center">
                   <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                       <Shield className="w-8 h-8 text-indigo-500" />
                   </div>
                   <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Event Organizer</h3>
                   <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
                       This user is officially verified to create and manage events on the platform.
                   </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;

import { useState, useEffect, useContext } from 'react';
import { Trophy, Medal, Star, Target, TrendingUp, Users } from 'lucide-react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import BadgeDisplay from '../components/common/BadgeDisplay';

const LeaderboardPage = () => {
  const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const [boardRes, myRankRes] = await Promise.all([
          api.get('leaderboard?limit=20'),
          user?.role === 'student' ? api.get('leaderboard/me').catch(() => null) : Promise.resolve(null)
        ]);

        setLeaderboard(boardRes.data);
        if (myRankRes?.data) setMyRank(myRankRes.data);
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user]);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-amber-100 text-amber-600 border-amber-200';
      case 2: return 'bg-slate-100 text-slate-500 border-slate-200';
      case 3: return 'bg-amber-900/10 text-amber-800 border-amber-900/20'; // Bronze
      default: return 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)]';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-amber-500" fill="currentColor" />;
      case 2: return <Medal className="w-5 h-5 text-slate-400" fill="currentColor" />;
      case 3: return <Medal className="w-5 h-5 text-amber-700" fill="currentColor" />;
      default: return <span className="font-bold">{rank}</span>;
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[var(--color-surface-primary)]">
      <div className="absolute inset-0 bg-mesh pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 mb-6 w-16 h-16">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-4">
            Campus Leaderboard
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Attend events, leave reviews, and engage with the community to earn points and climb the rankings.
          </p>
        </div>

        {/* Current User Stats Card */}
        {user?.role === 'student' && !loading && myRank && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-1 mb-10 shadow-xl">
            <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
              
              {/* Decorative background circle */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md">
                  <span className="text-2xl font-black">#{myRank.rank}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Your Ranking</h2>
                  <p className="text-white/80 font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" /> Top {(myRank.rank / (leaderboard.length || 1) * 100).toFixed(0)}% of campus
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-3 relative z-10 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                  <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                  <span className="text-lg font-bold text-slate-900">{myRank.points} <span className="text-sm text-slate-500">pts</span></span>
                </div>
                {myRank.badges?.length > 0 && <BadgeDisplay badges={myRank.badges} size="sm" />}
              </div>
            </div>
          </div>
        )}

        {/* Main Leaderboard Table */}
        <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-secondary)]/50">
            <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              TOP STUDENTS
            </h3>
            <span className="text-xs font-bold text-[var(--color-text-secondary)] px-3 py-1 bg-white border border-[var(--color-border)] rounded-full">
              Updated Live
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-[var(--color-border)]">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-tertiary)]"></div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-tertiary)]"></div>
                  <div className="w-32 h-4 bg-[var(--color-surface-tertiary)] rounded"></div>
                  <div className="ml-auto w-16 h-6 bg-[var(--color-surface-tertiary)] rounded"></div>
                </div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20 px-6">
              <Users className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No ranks yet</h3>
              <p className="text-[var(--color-text-secondary)]">The leaderboard is waiting for its first contender.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {leaderboard.map((student) => (
                <div 
                  key={student._id} 
                  className={`px-4 sm:px-6 py-4 flex items-center gap-4 sm:gap-6 hover:bg-[var(--color-surface-secondary)] transition-colors ${user?._id === student._id ? 'bg-indigo-50/50' : ''}`}
                >
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border font-bold text-lg shadow-sm ${getRankStyle(student.rank)}`}>
                    {getRankIcon(student.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-bold shadow-inner">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name & Badges */}
                  <div className="flex-grow min-w-0 flex flex-col py-1">
                    <span className="font-bold text-[var(--color-text-primary)] truncate flex items-center gap-2">
                      {student.name}
                      {user?._id === student._id && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase tracking-wider font-extrabold">You</span>}
                    </span>
                    <div className="mt-1">
                      <BadgeDisplay badges={student.badges} size="sm" />
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="font-bold text-xl text-[var(--color-text-primary)]">{student.points}</span>
                      <Star className="w-4 h-4 text-amber-500 mb-0.5" fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest">Points</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

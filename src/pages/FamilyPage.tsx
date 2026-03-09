import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, FamilyMember } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import Icon3D from '../components/Icon3D';
import { Users, UserPlus, Copy, Check, Trash2, Crown, Heart, Baby, User, Trophy } from 'lucide-react';

const ROLE_LABELS: Record<FamilyMember['role'], string> = {
  chef: 'Chef de famille',
  conjoint: 'Conjoint(e)',
  enfant: 'Enfant',
  frere_soeur: 'Frère/Sœur',
  autre: 'Autre',
};

const ROLE_EMOJIS: Record<FamilyMember['role'], string> = {
  chef: 'forkAndKnife',
  conjoint: 'cherryBlossom',
  enfant: 'seedling',
  frere_soeur: 'bustInSilhouette',
  autre: 'bustInSilhouette',
};

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sédentaire', multiplier: 1.2 },
  { value: 'light', label: 'Légèrement actif', multiplier: 1.375 },
  { value: 'moderate', label: 'Modérément actif', multiplier: 1.55 },
  { value: 'active', label: 'Actif', multiplier: 1.725 },
  { value: 'very_active', label: 'Très actif', multiplier: 1.9 },
];

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function calculateCalorieBudget(weight: number, height: number, age: number, sex: 'M' | 'F', activityLevel: string): number {
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'M' ? 5 : -161);
  const multiplier = ACTIVITY_OPTIONS.find(a => a.value === activityLevel)?.multiplier ?? 1.55;
  return Math.round(bmr * multiplier);
}

export default function FamilyPage() {
  const { family, setFamily, addFamilyMember, removeFamilyMember, profile } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add member form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<'conjoint' | 'enfant' | 'frere_soeur' | 'autre'>('conjoint');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const handleCreateFamily = () => {
    if (!profile) return;
    const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const chefId = Math.random().toString(36).slice(2, 10);
    const age = calculateAge(profile.birthDate);
    const dailyCalorieBudget = calculateCalorieBudget(
      profile.weightCurrentKg, profile.heightCm, age, profile.sex, profile.activityLevel
    );
    const chefMember: FamilyMember = {
      id: chefId,
      name: profile.name,
      role: 'chef',
      sex: profile.sex,
      birthDate: profile.birthDate,
      weightKg: profile.weightCurrentKg,
      heightCm: profile.heightCm,
      activityLevel: profile.activityLevel,
      dailyCalorieBudget,
    };
    setFamily({
      id: Math.random().toString(36).slice(2, 10),
      inviteCode,
      members: [chefMember],
      chefId,
    });
  };

  const handleCopyCode = async () => {
    if (!family) return;
    try {
      await navigator.clipboard.writeText(family.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleAddMember = () => {
    if (!name.trim() || !birthDate || !weight || !height) return;
    const age = calculateAge(birthDate);
    const dailyCalorieBudget = calculateCalorieBudget(
      parseFloat(weight), parseFloat(height), age, sex, activityLevel
    );
    const member: FamilyMember = {
      id: Math.random().toString(36).slice(2, 10),
      name: name.trim(),
      role,
      sex,
      birthDate,
      weightKg: parseFloat(weight),
      heightCm: parseFloat(height),
      activityLevel,
      dailyCalorieBudget,
    };
    addFamilyMember(member);
    // Reset form
    setName('');
    setRole('conjoint');
    setSex('M');
    setBirthDate('');
    setWeight('');
    setHeight('');
    setActivityLevel('moderate');
    setShowAddForm(false);
  };

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Ma famille</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {family ? `${family.members.length} membre${family.members.length > 1 ? 's' : ''}` : 'Gérez votre foyer'}
        </p>
      </div>

      {/* No family — Create section */}
      {!family && (
        <AnimatedCard index={0} className="p-6 overflow-hidden">
          <div className="relative">
            {/* Gradient background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary-400/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Users size={28} className="text-white" />
              </div>

              <h2 className="text-xl font-bold text-text-primary mb-2">Mode Famille</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Partagez vos repas avec votre famille. Chaque membre aura un profil adapté à ses besoins nutritionnels.
              </p>

              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-6">
                Gratuit pendant la bêta
              </span>

              <AnimatedButton onClick={handleCreateFamily} className="w-full py-3.5 text-sm flex items-center justify-center gap-2">
                <Users size={18} />
                Créer ma famille
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Family dashboard */}
      {family && (
        <div className="space-y-4">
          {/* Invite code card */}
          <AnimatedCard index={0} className="p-5">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Code d'invitation</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-surface-100 rounded-xl px-4 py-3 text-center">
                <span className="text-2xl font-mono font-black text-primary-500 tracking-[0.3em]">
                  {family.inviteCode}
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyCode}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  copied ? 'bg-green-100' : 'bg-primary-100'
                }`}
              >
                {copied ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-primary-500" />
                )}
              </motion.button>
            </div>
            <p className="text-xs text-text-muted text-center">
              Partagez ce code pour inviter des membres
            </p>
          </AnimatedCard>

          {/* Members list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Membres ({family.members.length})
              </h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddForm(!showAddForm)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  showAddForm ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-500'
                }`}
              >
                <UserPlus size={18} />
              </motion.button>
            </div>

            {/* Add member form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-white rounded-2xl border border-surface-200 p-4 space-y-3 shadow-sm">
                    <h4 className="text-sm font-semibold text-text-primary">Nouveau membre</h4>

                    {/* Name */}
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Prénom"
                      className="w-full px-3 py-2.5 bg-surface-100 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />

                    {/* Role */}
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as typeof role)}
                      className="w-full px-3 py-2.5 bg-surface-100 rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none"
                    >
                      <option value="conjoint">Conjoint(e)</option>
                      <option value="enfant">Enfant</option>
                      <option value="frere_soeur">Frère/Sœur</option>
                      <option value="autre">Autre</option>
                    </select>

                    {/* Sex */}
                    <div className="flex gap-2">
                      {(['M', 'F'] as const).map(s => (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSex(s)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                            sex === s
                              ? 'bg-primary-500 text-white'
                              : 'bg-surface-100 text-text-secondary'
                          }`}
                        >
                          {s === 'M' ? 'Homme' : 'Femme'}
                        </motion.button>
                      ))}
                    </div>

                    {/* Birth date */}
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-surface-100 rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />

                    {/* Weight & Height */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        placeholder="Poids (kg)"
                        className="px-3 py-2.5 bg-surface-100 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <input
                        type="number"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                        placeholder="Taille (cm)"
                        className="px-3 py-2.5 bg-surface-100 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>

                    {/* Activity level */}
                    <select
                      value={activityLevel}
                      onChange={e => setActivityLevel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-surface-100 rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none"
                    >
                      {ACTIVITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    {/* Submit */}
                    <AnimatedButton
                      onClick={handleAddMember}
                      disabled={!name.trim() || !birthDate || !weight || !height}
                      className="w-full py-3 text-sm flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} />
                      Ajouter
                    </AnimatedButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Member cards */}
            <div className="space-y-3">
              {family.members.map((member, i) => {
                const age = calculateAge(member.birthDate);
                const isChef = member.id === family.chefId;
                return (
                  <AnimatedCard key={member.id} index={i + 1} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-xl relative">
                        <Icon3D name={ROLE_EMOJIS[member.role]} size={24} />
                        {isChef && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning-300 rounded-full flex items-center justify-center shadow-sm">
                            <Crown size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-primary truncate">{member.name}</p>
                          {isChef && (
                            <span className="px-1.5 py-0.5 bg-warning-100 text-warning-500 text-[10px] font-bold rounded-md">
                              Chef
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted">
                          {ROLE_LABELS[member.role]} · {age} ans
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-sm font-bold text-primary-500">{member.dailyCalorieBudget}</p>
                          <p className="text-[10px] text-text-muted">kcal/jour</p>
                        </div>
                        {!isChef && (
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeFamilyMember(member.id)}
                            className="w-8 h-8 bg-error-50 rounded-lg flex items-center justify-center"
                          >
                            <Trash2 size={14} className="text-error-300" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>

            {/* Family Leaderboard */}
            {family.members.length > 1 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={16} className="text-warning-300" />
                  <h3 className="text-sm font-bold text-text-primary">Classement familial</h3>
                </div>
                <AnimatedCard index={family.members.length + 2} className="p-4">
                  <p className="text-xs text-text-muted mb-3">Qui est le plus régulier cette semaine ?</p>
                  <div className="space-y-2">
                    {family.members.map((member, idx) => {
                      const medals = ['firstPlace', 'secondPlace', 'thirdPlace'];
                      return (
                        <div key={member.id} className={`flex items-center gap-3 p-2 rounded-xl ${idx === 0 ? 'bg-warning-50' : 'bg-surface-50'}`}>
                          <span className="w-7 text-center">{medals[idx] ? <Icon3D name={medals[idx]} size={20} /> : `${idx + 1}.`}</span>
                          <Icon3D name={ROLE_EMOJIS[member.role]} size={20} />
                          <span className="text-sm font-medium text-text-primary flex-1">{member.name}</span>
                          <div className="text-right">
                            <p className="text-xs font-bold text-primary-500">{member.dailyCalorieBudget} kcal</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AnimatedCard>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}

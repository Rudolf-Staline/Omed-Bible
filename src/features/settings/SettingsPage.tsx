import React, { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { FontSize, LineHeight, FontFamily, Theme, Language } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { FEATURED_TRANSLATIONS } from '../../utils/bibleApi';
import { syncFileToDrive, syncFileFromDrive, DRIVE_FILES } from '../../utils/driveSync';
import { Settings, Cloud, LogOut, Download, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, synced, setSynced, loadSettings } = useSettingsStore();
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  // Loaders
  const { loadFavorites, favorites } = useFavoritesStore();
  const { loadHighlights, highlights } = useHighlightsStore();
  const { loadNotes, notes } = useNotesStore();
  const { loadPlans, progress } = usePlansStore();
  const setPosition = useBibleStore((state) => state.setPosition);

  const fontSizes: FontSize[] = ['S', 'M', 'L', 'XL'];
  const lineHeights: LineHeight[] = ['Normal', 'Relaxed', 'Large'];
  const fontFamilies: FontFamily[] = ['Lora', 'Inter'];
  const themes: Theme[] = ['Light', 'Sepia', 'Dark'];
  const languages: Language[] = ['Français', 'English'];

  const handleSyncData = async () => {
    if (!token) {
      toast.error("Vous devez être connecté pour synchroniser vos données.");
      return;
    }
    setSyncing(true);
    try {
      // Pour ce cas, on fusionne d'abord les données locales et distantes
      // ou on télécharge si local est vide (logique simplifiée)

      const remoteSettings = await syncFileFromDrive(DRIVE_FILES.settings, token);
      if (remoteSettings) loadSettings(remoteSettings);

      const remoteFavorites = await syncFileFromDrive(DRIVE_FILES.favorites, token);
      if (remoteFavorites) loadFavorites(remoteFavorites);

      const remoteHighlights = await syncFileFromDrive(DRIVE_FILES.highlights, token);
      if (remoteHighlights) loadHighlights(remoteHighlights);

      const remoteNotes = await syncFileFromDrive(DRIVE_FILES.notes, token);
      if (remoteNotes) loadNotes(remoteNotes);

      const remotePlans = await syncFileFromDrive(DRIVE_FILES.plans, token);
      if (remotePlans) loadPlans(remotePlans);

      const remotePosition = await syncFileFromDrive(DRIVE_FILES.position, token);
      if (remotePosition) setPosition(remotePosition.translation, remotePosition.bookId, remotePosition.chapter);

      // Si sync = on, on active la synchro automatique
      setSynced(true);
      toast.success("Synchronisation réussie !");
    } catch (err) {
      console.error(err);
      toast.error("Échec de la synchronisation.");
    } finally {
      setSyncing(false);
    }
  };

  const handleForceUpload = async () => {
    if (!token) return;
    setSyncing(true);
    try {
      await Promise.all([
        syncFileToDrive(DRIVE_FILES.settings, settings, token),
        syncFileToDrive(DRIVE_FILES.favorites, favorites, token),
        syncFileToDrive(DRIVE_FILES.highlights, highlights, token),
        syncFileToDrive(DRIVE_FILES.notes, notes, token),
        syncFileToDrive(DRIVE_FILES.plans, progress, token),
      ]);
      setSynced(true);
      toast.success("Sauvegarde en ligne réussie !");
    } catch(err) {
      toast.error("Échec de la sauvegarde.");
    } finally {
      setSyncing(false);
    }
  }

  const exportData = () => {
    const data = {
      settings,
      favorites,
      highlights,
      notes,
      progress,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omed_bible_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes vos données locales ? Cette action est irréversible.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8 text-text-primary flex items-center gap-3">
        <Settings className="text-accent-gold" />
        Paramètres
      </h1>

      <div className="space-y-8">
        {/* Section: Apparence */}
        <section className="bg-bg-card border border-border rounded-xl p-6">
          <h2 className="font-display font-semibold text-xl text-text-primary mb-6">Apparence & Lecture</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Version par défaut</label>
              <select
                value={settings.defaultTranslation}
                onChange={(e) => updateSettings({ defaultTranslation: e.target.value })}
                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-gold"
              >
                {FEATURED_TRANSLATIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.short})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Taille de police</label>
              <div className="flex gap-2 bg-bg-primary p-1 rounded-lg border border-border">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      settings.fontSize === size
                        ? 'bg-bg-card shadow-sm text-text-primary border border-border/50'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Interligne</label>
              <div className="flex gap-2 bg-bg-primary p-1 rounded-lg border border-border">
                {lineHeights.map((lh) => (
                  <button
                    key={lh}
                    onClick={() => updateSettings({ lineHeight: lh })}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      settings.lineHeight === lh
                        ? 'bg-bg-card shadow-sm text-text-primary border border-border/50'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {lh}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Police de lecture</label>
              <div className="flex gap-2 bg-bg-primary p-1 rounded-lg border border-border">
                {fontFamilies.map((ff) => (
                  <button
                    key={ff}
                    onClick={() => updateSettings({ fontFamily: ff })}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      settings.fontFamily === ff
                        ? 'bg-bg-card shadow-sm text-text-primary border border-border/50'
                        : 'text-text-muted hover:text-text-primary'
                    } ${ff === 'Lora' ? 'font-serif' : 'font-sans'}`}
                  >
                    {ff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Thème</label>
              <div className="flex gap-2 bg-bg-primary p-1 rounded-lg border border-border">
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      updateSettings({ theme: t });
                      // Appliquer la classe sur le body/html dans un vrai système (pas implémenté pour cet exercice)
                    }}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      settings.theme === t
                        ? 'bg-bg-card shadow-sm text-text-primary border border-border/50'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Langue de l'interface</label>
              <div className="flex gap-2 bg-bg-primary p-1 rounded-lg border border-border">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => updateSettings({ language: l })}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      settings.language === l
                        ? 'bg-bg-card shadow-sm text-text-primary border border-border/50'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Compte & Synchro */}
        <section className="bg-bg-card border border-border rounded-xl p-6">
          <h2 className="font-display font-semibold text-xl text-text-primary mb-6">Compte Google & Synchronisation</h2>

          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-bg-primary p-4 rounded-xl border border-border">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold text-xl">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-text-primary">{user.name}</h3>
                  <p className="text-text-secondary">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="flex items-center justify-center gap-2 w-full bg-accent-gold hover:bg-accent-brown text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Cloud size={20} />
                  {syncing ? 'Synchronisation...' : 'Restaurer depuis Google Drive'}
                </button>

                <button
                  onClick={handleForceUpload}
                  disabled={syncing}
                  className="flex items-center justify-center gap-2 w-full bg-bg-secondary hover:bg-border text-text-primary py-3 rounded-lg font-medium transition-colors disabled:opacity-50 border border-border"
                >
                  <RefreshCw size={20} />
                  Sauvegarder sur Google Drive
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-text-muted mt-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${synced ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  État : {synced ? 'Synchronisation automatique activée' : 'Non synchronisé'}
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={() => {
                    logout();
                    setSynced(false);
                  }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-secondary mb-4">Connectez-vous pour synchroniser vos données sur tous vos appareils.</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-bg-secondary hover:bg-border text-text-primary px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Se connecter
              </button>
            </div>
          )}
        </section>

        {/* Section: Données */}
        <section className="bg-bg-card border border-border rounded-xl p-6">
          <h2 className="font-display font-semibold text-xl text-text-primary mb-6">Données locales</h2>

          <div className="space-y-4">
            <button
              onClick={exportData}
              className="flex items-center gap-3 w-full p-4 rounded-lg border border-border hover:bg-bg-primary transition-colors text-left"
            >
              <div className="p-2 bg-bg-secondary rounded-lg text-accent-brown">
                <Download size={20} />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Exporter les données</h4>
                <p className="text-sm text-text-muted">Télécharger une sauvegarde JSON de vos favoris, notes et paramètres.</p>
              </div>
            </button>

            <button
              onClick={clearData}
              className="flex items-center gap-3 w-full p-4 rounded-lg border border-red-100 hover:bg-red-50 transition-colors text-left"
            >
              <div className="p-2 bg-red-100 rounded-lg text-red-500">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-medium text-red-600">Effacer toutes les données</h4>
                <p className="text-sm text-red-400">Supprimer définitivement les données locales (irréversible).</p>
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

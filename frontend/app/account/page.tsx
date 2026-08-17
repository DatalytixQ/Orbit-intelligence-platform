"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Key, Globe, Shield, CheckCircle, AlertCircle, Lock } from "lucide-react";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import { useTranslations } from "next-intl";

export default function UserProfilePage() {
  const t = useTranslations('Profile');

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Language state
  const [selectedLang, setSelectedLang] = useState<string>("es");
  const [savingLang, setSavingLang] = useState(false);
  const [langSuccess, setLangSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const token = localStorage.getItem("datalytixq_token");
      const res = await fetch(`${baseUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setSelectedLang(data.user.language_preference || "es");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanguage = async () => {
    setSavingLang(true);
    setLangSuccess(false);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const token = localStorage.getItem("datalytixq_token");
      const res = await fetch(`${baseUrl}/api/auth/profile/language`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ language: selectedLang })
      });

      if (res.ok) {
        document.cookie = `NEXT_LOCALE=${selectedLang}; path=/; max-age=31536000; SameSite=Lax`;
        setLangSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (err) {
      console.error("Error saving language:", err);
    } finally {
      setSavingLang(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    if (newPassword !== confirmPassword) {
      setPassError(t('passwords_dont_match'));
      return;
    }
    if (newPassword.length < 8) {
      setPassError(t('password_min_length'));
      return;
    }

    setChangingPass(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const token = localStorage.getItem("datalytixq_token");
      const res = await fetch(`${baseUrl}/api/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setPassSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassError(data.error || "Error al cambiar contraseña");
      }
    } catch (err) {
      setPassError("Error al conectar con el servidor");
    } finally {
      setChangingPass(false);
    }
  };

  const user = profileData?.user;
  const permissions = profileData?.permissions || [];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto w-full space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                <User className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                {t('title')}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Administra tus datos personales, preferencias de idioma y seguridad.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Personal Information */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/60 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl mb-4 border border-indigo-200 dark:border-indigo-800">
                    {user?.full_name?.charAt(0) || "U"}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user?.full_name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>

                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-full border border-indigo-200 dark:border-indigo-800">
                      {user?.role_name || "Rol Asignado"}
                    </span>
                    {user?.is_admin && (
                      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold text-xs rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {t('admin_badge')}
                      </span>
                    )}
                  </div>

                  <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 text-left space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">{t('organization')}</span>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold">{user?.client_name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">{t('member_since')}</span>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Language, Security & Permissions */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Language Preference */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    {t('language_section')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {t('language_description')}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="es">🇪🇸 {t('spanish')}</option>
                      <option value="en">🇺🇸 {t('english')}</option>
                    </select>

                    <button
                      onClick={handleSaveLanguage}
                      disabled={savingLang}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {savingLang ? t('saving') : t('save_language')}
                    </button>

                    {langSuccess && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {t('saved')}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Change Password */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-indigo-500" />
                    {t('password_section')}
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {t('current_password')}
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          {t('new_password')}
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          {t('confirm_password')}
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {passError && (
                      <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-4 h-4" /> {passError}
                      </div>
                    )}

                    {passSuccess && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-4 h-4" /> {t('password_changed')}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={changingPass}
                      className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {changingPass ? t('changing') : t('change_password')}
                    </button>
                  </form>
                </motion.div>

                {/* Read-Only Access & Permissions */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5 text-indigo-500" />
                    {t('access_section')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {t('access_description')}
                  </p>

                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 font-semibold">{t('report')}</th>
                          <th className="px-4 py-3 font-semibold text-right">Permiso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {permissions.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                              {t('no_permissions')}
                            </td>
                          </tr>
                        ) : (
                          permissions.map((p: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                                {p.report_name || `Reporte (${p.report_id})`}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.can_update 
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {p.can_update ? t('can_edit') : t('view_only')}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

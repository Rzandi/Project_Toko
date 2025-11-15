import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Lock, Bell, Palette, LogOut, Upload } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import toast from 'react-hot-toast'

interface BusinessProfile {
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
  businessCity: string
  businessPostalCode: string
  taxId: string
  bankName: string
  bankAccount: string
}

interface UserSettings {
  fullName: string
  email: string
  phone: string
  role: string
}

interface NotificationSettings {
  emailNotifications: boolean
  invoiceReminders: boolean
  paymentNotifications: boolean
  newsletterSubscription: boolean
}

const SettingSection = ({ icon: Icon, title, description, children }: any) => (
  <Card variant="default">
    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
      <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {description}
        </p>
      </div>
    </div>
    {children}
  </Card>
)

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'appearance'>('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Business Profile
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    businessName: 'PT Maju Jaya Indonesia',
    businessEmail: 'accounting@majujaya.com',
    businessPhone: '+62 812 3456 7890',
    businessAddress: 'Jl. Sudirman No. 123',
    businessCity: 'Jakarta',
    businessPostalCode: '12345',
    taxId: '01.234.567.8-012.000',
    bankName: 'Bank Mandiri',
    bankAccount: '1234567890'
  })

  // User Settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    fullName: 'John Doe',
    email: 'john@majujaya.com',
    phone: '+62 812 9876 5432',
    role: 'Admin'
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    invoiceReminders: true,
    paymentNotifications: true,
    newsletterSubscription: false
  })

  // Theme
  const [theme, setTheme] = useState('auto')
  const [language, setLanguage] = useState('id')

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Pengaturan berhasil disimpan')
  }

  const handleLogout = () => {
    toast.success('Berhasil logout')
    // Redirect to login
    window.location.href = '/auth/login'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Kelola profil dan preferensi Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {[
          { id: 'profile' as const, label: 'Profil Bisnis', icon: '🏢' },
          { id: 'account' as const, label: 'Akun', icon: '👤' },
          { id: 'notifications' as const, label: 'Notifikasi', icon: '🔔' },
          { id: 'appearance' as const, label: 'Tampilan', icon: '🎨' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Business Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <SettingSection
              icon={User}
              title="Profil Bisnis"
              description="Informasi utama perusahaan Anda"
            >
              <div className="space-y-4">
                <Input
                  label="Nama Bisnis"
                  placeholder="Nama perusahaan"
                  value={businessProfile.businessName}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })}
                />
                <Input
                  label="Email Bisnis"
                  type="email"
                  placeholder="email@perusahaan.com"
                  value={businessProfile.businessEmail}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, businessEmail: e.target.value })}
                />
                <Input
                  label="Telepon Bisnis"
                  placeholder="+62 812 3456 7890"
                  value={businessProfile.businessPhone}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, businessPhone: e.target.value })}
                />
                <Input
                  label="Alamat"
                  placeholder="Jalan, nomor"
                  value={businessProfile.businessAddress}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, businessAddress: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Kota"
                    placeholder="Jakarta"
                    value={businessProfile.businessCity}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessCity: e.target.value })}
                  />
                  <Input
                    label="Kode Pos"
                    placeholder="12345"
                    value={businessProfile.businessPostalCode}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, businessPostalCode: e.target.value })}
                  />
                </div>
              </div>
            </SettingSection>

            <SettingSection
              icon={Lock}
              title="Informasi Pajak"
              description="Data NPWP dan bank perusahaan"
            >
              <div className="space-y-4">
                <Input
                  label="Nomor NPWP"
                  placeholder="XX.XXX.XXX.X-XXX.000"
                  value={businessProfile.taxId}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, taxId: e.target.value })}
                />
                <Input
                  label="Nama Bank"
                  placeholder="Bank Mandiri"
                  value={businessProfile.bankName}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, bankName: e.target.value })}
                />
                <Input
                  label="Nomor Rekening"
                  placeholder="1234567890"
                  value={businessProfile.bankAccount}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, bankAccount: e.target.value })}
                />
              </div>
            </SettingSection>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <SettingSection
              icon={User}
              title="Data Akun"
              description="Informasi pengguna yang saat ini login"
            >
              <div className="space-y-4 mb-6">
                <Input
                  label="Nama Lengkap"
                  placeholder="Nama Anda"
                  value={userSettings.fullName}
                  onChange={(e) => setUserSettings({ ...userSettings, fullName: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                />
                <Input
                  label="Telepon"
                  placeholder="+62 812 3456 7890"
                  value={userSettings.phone}
                  onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                />
              </div>
            </SettingSection>

            <SettingSection
              icon={Lock}
              title="Keamanan"
              description="Kelola password dan keamanan akun"
            >
              <div className="space-y-4 mb-6">
                <Button variant="secondary" fullWidth>
                  <Lock size={18} className="mr-2" />
                  Ubah Password
                </Button>
                <Button variant="secondary" fullWidth>
                  <Lock size={18} className="mr-2" />
                  Aktifkan Two-Factor Authentication
                </Button>
              </div>
            </SettingSection>

            <SettingSection
              icon={LogOut}
              title="Logout"
              description="Keluar dari akun Anda"
            >
              <Button variant="secondary" fullWidth onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </SettingSection>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <SettingSection
            icon={Bell}
            title="Notifikasi"
            description="Atur preferensi notifikasi Anda"
          >
            <div className="space-y-4">
              {[
                {
                  key: 'emailNotifications',
                  label: 'Email Notifikasi',
                  description: 'Terima notifikasi via email'
                },
                {
                  key: 'invoiceReminders',
                  label: 'Invoice Reminders',
                  description: 'Pengingat untuk invoice yang akan jatuh tempo'
                },
                {
                  key: 'paymentNotifications',
                  label: 'Notifikasi Pembayaran',
                  description: 'Pemberitahuan ketika ada pembayaran masuk'
                },
                {
                  key: 'newsletterSubscription',
                  label: 'Newsletter',
                  description: 'Tips dan update terbaru tentang InvoiceEase'
                }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key as keyof NotificationSettings]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: e.target.checked
                      })}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
              ))}
            </div>
          </SettingSection>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <SettingSection
              icon={Palette}
              title="Tema"
              description="Pilih tema tampilan aplikasi"
            >
              <div className="space-y-3">
                {[
                  { value: 'light', label: '☀️ Light', color: 'bg-white' },
                  { value: 'dark', label: '🌙 Dark', color: 'bg-slate-900' },
                  { value: 'auto', label: '⚙️ Auto', color: 'bg-linear-to-r from-white to-slate-900' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      theme === option.value
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-rose-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded ${option.color} border border-slate-300`}></div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </SettingSection>

            <SettingSection
              icon={Palette}
              title="Bahasa"
              description="Pilih bahasa yang Anda gunakan"
            >
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { value: 'id', label: '🇮🇩 Bahasa Indonesia' },
                  { value: 'en', label: '🇬🇧 English' }
                ]}
              />
            </SettingSection>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t border-slate-200 dark:border-slate-700 -mx-6 px-6 py-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save size={18} className="mr-2" />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </div>
  )
}

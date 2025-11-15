import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, FileText, Phone, Mail, MapPin, MoreVertical } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, FinancialCard } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton'
import toast from 'react-hot-toast'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  city: string
  address: string
  status: 'active' | 'inactive'
  totalInvoices: number
  totalAmount: number
}

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'PT Maju Jaya',
      email: 'info@majujaya.com',
      phone: '+62 812 3456 7890',
      company: 'PT Maju Jaya Indonesia',
      city: 'Jakarta',
      address: 'Jl. Sudirman No. 123',
      status: 'active',
      totalInvoices: 12,
      totalAmount: 150000000
    },
    {
      id: '2',
      name: 'CV Sukses Bersama',
      email: 'sales@suksesbersama.com',
      phone: '+62 821 9876 5432',
      company: 'CV Sukses Bersama',
      city: 'Surabaya',
      address: 'Jl. Gajah Mada No. 456',
      status: 'active',
      totalInvoices: 8,
      totalAmount: 95000000
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    address: ''
  })

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        city: client.city,
        address: client.address
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        city: '',
        address: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveClient = () => {
    if (!formData.name || !formData.email) {
      toast.error('Nama dan email harus diisi')
      return
    }

    if (editingClient) {
      setClients(clients.map(c =>
        c.id === editingClient.id
          ? { ...c, ...formData }
          : c
      ))
      toast.success('Client berhasil diperbarui')
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        totalInvoices: 0,
        totalAmount: 0
      }
      setClients([...clients, newClient])
      toast.success('Client berhasil ditambahkan')
    }

    setIsModalOpen(false)
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id))
    toast.success('Client berhasil dihapus')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Klien</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Kelola data klien bisnis Anda</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinancialCard
          label="Total Klien"
          value={clients.length}
          variant="primary"
          icon={<Phone size={20} />}
        />
        <FinancialCard
          label="Klien Aktif"
          value={clients.filter(c => c.status === 'active').length}
          variant="secondary"
          icon={<FileText size={20} />}
        />
        <FinancialCard
          label="Total Invoices"
          value={clients.reduce((sum, c) => sum + c.totalInvoices, 0)}
          variant="success"
          icon={<Mail size={20} />}
        />
      </div>

      {/* Search & Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari nama klien, email, atau perusahaan..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="md:self-end"
          >
            <Plus size={18} className="mr-2" />
            Tambah Klien
          </Button>
        </div>
      </Card>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="gradient" className="relative group">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {client.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {client.company}
                    </p>
                  </div>
                  <div className="relative group">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                      <button
                        onClick={() => handleOpenModal(client)}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail size={16} />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone size={16} />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={16} />
                    <span>{client.city}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Invoices</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {client.totalInvoices}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                      <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                        Rp{(client.totalAmount / 1000000).toFixed(0)}M
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {client.status === 'active' ? '✓ Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<FileText size={48} />}
            title="Tidak ada klien"
            description={searchQuery ? 'Tidak ditemukan klien sesuai pencarian' : 'Mulai dengan menambahkan klien pertama'}
            action={{
              label: 'Tambah Klien',
              onClick: () => handleOpenModal()
            }}
          />
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Edit Klien' : 'Tambah Klien Baru'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveClient}
            >
              {editingClient ? 'Perbarui' : 'Tambah'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama Klien"
            placeholder="Contoh: PT Maju Jaya"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="contoh@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Nomor Telepon"
            placeholder="+62 812 3456 7890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Perusahaan"
            placeholder="Nama perusahaan"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <Input
            label="Kota"
            placeholder="Jakarta"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <Input
            label="Alamat"
            placeholder="Jalan, nomor, RT/RW"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </Modal>

      {/* FAB */}
      <FloatingActionButton
        icon={<Plus size={24} />}
        onClick={() => handleOpenModal()}
        label="Tambah Klien"
        color="rose"
      />
    </div>
  )
}

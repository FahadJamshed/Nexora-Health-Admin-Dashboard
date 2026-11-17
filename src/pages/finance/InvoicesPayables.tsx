import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable, { Column } from '../../components/shared/DataTable';
import DetailDrawer from '../../components/shared/DetailDrawer';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceLineItem } from '../../types';

export const InvoicesPayables: React.FC = () => {
  const { invoices, vendors, bankAccounts, addInvoice, recordInvoicePayment, showToast } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Record Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [targetInvoice, setTargetInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [debitBank, setDebitBank] = useState<string>(
    bankAccounts[0]?.accountName || 'JPMorgan Chase Bank - Operating Account'
  );

  // Add Invoice Modal State
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [newVendorId, setNewVendorId] = useState(vendors[0]?.id || '');
  const [newDueDate, setNewDueDate] = useState('2025-06-15');
  const [newCategory, setNewCategory] = useState<Invoice['category']>('IT Services');
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<'profile' | 'items'>('profile');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { description: 'Cloud Infrastructure Hosting & PostgreSQL', quantity: 1, unitPrice: 350000, total: 350000 },
  ]);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'All' && inv.paymentStatus !== statusFilter) return false;
    if (categoryFilter !== 'All' && inv.category !== categoryFilter) return false;
    return true;
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const overdueCount = invoices.filter((inv) => inv.paymentStatus === 'Overdue').length;

  const handleOpenDetail = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsDetailOpen(true);
  };

  const handleOpenPaymentModal = (inv: Invoice) => {
    setTargetInvoice(inv);
    const balance = inv.totalAmount - inv.paidAmount;
    setPaymentAmount(balance > 0 ? balance : 0);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!targetInvoice) return;
    if (paymentAmount <= 0) {
      showToast('Invalid Amount', 'Payment amount must be greater than zero.', 'error');
      return;
    }

    recordInvoicePayment(targetInvoice.id, paymentAmount);
    setIsPaymentModalOpen(false);
    setTargetInvoice(null);
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: 'Consulting / Engineering Service', quantity: 1, unitPrice: 50000, total: 50000 },
    ]);
  };

  const handleUpdateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].total = Number(updated[index].quantity) * Number(updated[index].unitPrice);
    }
    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === newVendorId) || vendors[0];
    const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0);
    const tax = Math.round(subtotal * 0.13); // 13% State Tax Sales Tax
    const totalAmount = subtotal + tax;

    addInvoice({
      vendorId: vendor?.id || 'VND-001',
      vendorName: vendor?.name || 'Acme Corporation',
      dueDate: newDueDate,
      category: newCategory,
      lineItems: lineItems,
      subtotal: subtotal,
      tax: tax,
      totalAmount: totalAmount,
    });

    setIsAddInvoiceOpen(false);
  };

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice ID',
      sortable: true,
      render: (inv) => (
        <button
          onClick={() => handleOpenDetail(inv)}
          className="font-bold text-[#2776EA] hover:underline focus:outline-hidden"
        >
          {inv.invoiceNumber}
        </button>
      ),
    },
    {
      key: 'vendorName',
      header: 'Vendor & Category',
      sortable: true,
      render: (inv) => (
        <div>
          <span className="font-semibold text-[#102A43] block leading-tight">{inv.vendorName}</span>
          <span className="text-[11px] text-[#8A97A8]">{inv.category}</span>
        </div>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      sortable: true,
      render: (inv) => <span className="text-xs text-[#8A97A8]">{inv.issueDate}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (inv) => <span className="text-xs text-[#40516A]">{inv.dueDate}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Total Payable',
      sortable: true,
      render: (inv) => (
        <div>
          <span className="font-bold text-[#102A43] block">
            PKR {inv.totalAmount.toLocaleString()}
          </span>
          {inv.paidAmount > 0 && inv.paidAmount < inv.totalAmount && (
            <span className="text-[10px] text-[#16865B]">
              Paid: PKR {inv.paidAmount.toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      sortable: true,
      render: (inv) => <Badge value={inv.paymentStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Invoices & Payables"
        description="Operational vendor accounts payable, technology infrastructure billing, hospital retainer contracts, and disbursements."
        breadcrumbs={['Financial Management', 'Invoices & Payables']}
        primaryAction={{
          label: 'Create Vendor Invoice',
          icon: 'plus',
          onClick: () => setIsAddInvoiceOpen(true),
        }}
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Total Invoiced</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#102A43]">
              PKR {(totalInvoiced / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-[#8A97A8]">{invoices.length} invoices</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">YTD approved payables</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16865B]">Total Disbursed</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#16865B]">
              PKR {(totalPaid / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-[#16865B] font-semibold">
              {Math.round((totalPaid / totalInvoiced) * 100)}% Settled
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Paid to vendors</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D69B32]">Outstanding Balance</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[#D69B32]">
              PKR {(totalOutstanding / 1000000).toFixed(2)}M
            </span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Due this billing cycle</span>
        </div>

        <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545]">Overdue Invoices</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#D64545]">{overdueCount}</span>
            <span className="text-xs text-[#D64545] font-semibold">&gt; 30 days</span>
          </div>
          <span className="text-[11px] text-[#66758A] mt-1 block">Requires immediate finance signoff</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#E5EAF1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Unpaid', 'Partial', 'Paid', 'Overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-[#66758A] hover:bg-[#F6F8FC] hover:text-[#102A43]'
              }`}
            >
              {status === 'All' ? 'All Invoices' : status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A97A8]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-[#E5EAF1] rounded-lg px-2.5 py-1.5 text-[#102A43] bg-white focus:outline-hidden focus:border-[#2776EA]"
          >
            <option value="All">All Categories</option>
            <option value="IT Services">IT Services</option>
            <option value="Medical Supplies">Medical Supplies</option>
            <option value="Legal & Audit">Legal & Audit</option>
            <option value="Consulting">Consulting</option>
            <option value="Facilities">Facilities</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredInvoices}
        columns={columns}
        searchPlaceholder="Search invoices by ID, vendor, or category..."
        searchKey="invoiceNumber"
        onRowClick={handleOpenDetail}
        actions={[
          {
            label: 'View Printable Invoice',
            icon: 'eye',
            onClick: handleOpenDetail,
          },
          {
            label: 'Record Payment',
            icon: 'check',
            onClick: handleOpenPaymentModal,
            show: (inv) => inv.paymentStatus !== 'Paid',
          },
        ]}
      />

      {/* Detail Slide-Over Drawer */}
      {selectedInvoice && (
        <DetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Invoice ${selectedInvoice.invoiceNumber}`}
          subtitle={`${selectedInvoice.vendorName} • Issued ${selectedInvoice.issueDate}`}
          badge={<Badge value={selectedInvoice.paymentStatus} />}
          tabs={['Invoice Bill', 'Payment Log']}
          footer={
            selectedInvoice.paymentStatus !== 'Paid' && (
              <div className="flex items-center justify-end gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-3 py-1.5 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleOpenPaymentModal(selectedInvoice);
                  }}
                  className="px-4 py-1.5 bg-[#16865B] text-white rounded-lg text-xs font-semibold hover:bg-[#13724c]"
                >
                  Record Payment
                </button>
              </div>
            )
          }
        >
          {(activeTab) => (
            <div className="space-y-4">
              {activeTab === 'Invoice Bill' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#F6F8FC] p-4 rounded-xl border border-[#E5EAF1] grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Vendor / Supplier</span>
                      <span className="font-semibold text-[#102A43] text-sm">{selectedInvoice.vendorName}</span>
                      <span className="text-[11px] text-[#66758A] block">{selectedInvoice.category}</span>
                    </div>
                    <div>
                      <span className="text-[#8A97A8] block text-[11px]">Payment Due Date</span>
                      <span className="font-semibold text-[#102A43] text-sm">{selectedInvoice.dueDate}</span>
                      <span className="text-[11px] text-[#8A97A8] block">Terms: Net 30</span>
                    </div>
                  </div>

                  <div className="border border-[#E5EAF1] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F6F8FC] text-[#66758A] border-b border-[#E5EAF1]">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Item Description</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Unit Price</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5EAF1]">
                        {selectedInvoice.lineItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 font-medium text-[#102A43]">{item.description}</td>
                            <td className="py-2.5 px-3 text-center text-[#66758A]">{item.quantity}</td>
                            <td className="py-2.5 px-3 text-right text-[#40516A]">
                              PKR {item.unitPrice.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-[#102A43]">
                              PKR {item.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-3 bg-[#F6F8FC] border-t border-[#E5EAF1] space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#66758A]">
                        <span>Subtotal:</span>
                        <span>PKR {selectedInvoice.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[#66758A]">
                        <span>State Healthcare Tax (8.5%):</span>
                        <span>PKR {selectedInvoice.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-[#102A43] pt-1 border-t border-[#E5EAF1]">
                        <span>Grand Total:</span>
                        <span>PKR {selectedInvoice.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Payment Log' && (
                <div className="p-4 bg-[#F6F8FC] rounded-xl border border-[#E5EAF1] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Paid to Date:</span>
                    <span className="font-bold text-[#16865B]">
                      PKR {selectedInvoice.paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Remaining Balance:</span>
                    <span className="font-bold text-[#D69B32]">
                      PKR {(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A97A8]">Payment Date:</span>
                    <span className="text-[#102A43]">{selectedInvoice.paymentDate || 'Not yet fully paid'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailDrawer>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Vendor Payment"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmPayment}
              className="px-4 py-2 bg-[#16865B] hover:bg-[#13724c] text-white rounded-lg text-xs font-semibold"
            >
              Confirm Disbursal
            </button>
          </div>
        }
      >
        {targetInvoice && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F6F8FC] border border-[#E5EAF1] rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Invoice:</span>
                <span className="font-bold text-[#102A43]">{targetInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Vendor:</span>
                <span className="font-semibold text-[#102A43]">{targetInvoice.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Total Amount:</span>
                <span className="text-[#102A43]">PKR {targetInvoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A97A8]">Already Paid:</span>
                <span className="text-[#16865B]">PKR {targetInvoice.paidAmount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Payment Amount (PKR) *</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-sm font-bold text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">Debited Bank Account</label>
              <select
                value={debitBank}
                onChange={(e) => setDebitBank(e.target.value)}
                className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={`${b.bankName} - ${b.accountName}`}>
                    {b.bankName} ({b.accountName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Invoice Modal with Multi-tab & Sticky Footer */}
      <Modal
        isOpen={isAddInvoiceOpen}
        onClose={() => setIsAddInvoiceOpen(false)}
        title="Add Vendor Payable Invoice"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveInvoiceTab('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeInvoiceTab === 'profile' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                1. Vendor & Terms
              </button>
              <button
                type="button"
                onClick={() => setActiveInvoiceTab('items')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeInvoiceTab === 'items' ? 'bg-[#102A43] text-white' : 'text-[#66758A] hover:bg-[#F6F8FC]'
                }`}
              >
                2. Line Items ({lineItems.length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddInvoiceOpen(false)}
                className="px-4 py-2 border border-[#E5EAF1] rounded-lg text-xs font-semibold text-[#66758A] hover:bg-[#F6F8FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateInvoice}
                className="px-4 py-2 bg-[#2776EA] hover:bg-[#1f5ec2] text-white rounded-lg text-xs font-semibold"
              >
                Save Invoice
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          {activeInvoiceTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Vendor *</label>
                  <select
                    value={newVendorId}
                    onChange={(e) => setNewVendorId(e.target.value)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                    required
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  >
                    <option value="IT Services">IT Services</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Legal & Audit">Legal & Audit</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">Payment Due Date *</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full border border-[#E5EAF1] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-hidden focus:border-[#2776EA]"
                  required
                />
              </div>

              <div className="p-3 bg-[#F6F8FC] rounded-lg border border-[#E5EAF1] text-[11px] text-[#66758A]">
                Invoices default to Net-30 payment terms and require financial review prior to bank disbursement.
              </div>
            </div>
          )}

          {activeInvoiceTab === 'items' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#102A43]">Invoice Line Items</span>
                <button
                  type="button"
                  onClick={handleAddLineItem}
                  className="text-xs text-[#2776EA] font-semibold hover:underline flex items-center gap-1"
                >
                  <Icon name="plus" size={12} /> Add Item
                </button>
              </div>

              {lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[#F6F8FC] p-2 rounded-lg border border-[#E5EAF1]">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateLineItem(idx, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full border border-[#E5EAF1] rounded px-2 py-1 text-xs bg-white text-[#102A43]"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateLineItem(idx, 'quantity', Number(e.target.value))}
                      className="w-full border border-[#E5EAF1] rounded px-2 py-1 text-xs bg-white text-[#102A43] text-center"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateLineItem(idx, 'unitPrice', Number(e.target.value))}
                      className="w-full border border-[#E5EAF1] rounded px-2 py-1 text-xs bg-white text-[#102A43]"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(idx)}
                      className="text-[#D64545] hover:text-[#b53737]"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-[#E5EAF1] flex justify-between items-center text-xs font-bold text-[#102A43]">
                <span>Total Estimated Payable (incl. 13% Tax):</span>
                <span>
                  PKR {Math.round(lineItems.reduce((s, i) => s + i.total, 0) * 1.13).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
export default InvoicesPayables;

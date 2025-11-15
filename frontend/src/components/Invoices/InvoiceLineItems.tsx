import React from 'react';
import { LineItem } from '../../hooks/useInvoices';

interface InvoiceLineItemsProps {
  items: LineItem[];
  onItemsChange: (items: LineItem[]) => void;
  onTotalChange: (subtotal: number, taxAmount: number, total: number) => void;
}

export const InvoiceLineItems: React.FC<InvoiceLineItemsProps> = ({
  items,
  onItemsChange,
  onTotalChange,
}) => {
  const handleAddItem = () => {
    const newItem: LineItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0,
    };
    const updatedItems = [...items, newItem];
    onItemsChange(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onItemsChange(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof LineItem,
    value: any
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    onItemsChange(updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (itemList: LineItem[]) => {
    let subtotal = 0;
    let taxAmount = 0;

    itemList.forEach((item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemTax = itemSubtotal * (item.tax / 100);
      subtotal += itemSubtotal;
      taxAmount += itemTax;
    });

    const total = subtotal + taxAmount;
    onTotalChange(subtotal, taxAmount, total);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Item Invoice
        </h3>
        <button
          type="button"
          onClick={handleAddItem}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          + Tambah Item
        </button>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-semibold">
                Deskripsi
              </th>
              <th className="px-4 py-2 text-right text-gray-900 dark:text-white font-semibold w-20">
                Qty
              </th>
              <th className="px-4 py-2 text-right text-gray-900 dark:text-white font-semibold w-24">
                Harga
              </th>
              <th className="px-4 py-2 text-right text-gray-900 dark:text-white font-semibold w-20">
                Pajak %
              </th>
              <th className="px-4 py-2 text-right text-gray-900 dark:text-white font-semibold w-20">
                Subtotal
              </th>
              <th className="px-4 py-2 text-center w-12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item, index) => {
              const subtotal = item.quantity * item.unitPrice;
              const taxAmount = subtotal * (item.tax / 100);

              return (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">
                    <input
                      id={`item-description-${index}`}
                      name={`items[${index}].description`}
                      aria-label={`Deskripsi item ${index + 1}`}
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                      placeholder="Deskripsi item"
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      id={`item-quantity-${index}`}
                      name={`items[${index}].quantity`}
                      aria-label={`Kuantitas item ${index + 1}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      id={`item-unitPrice-${index}`}
                      name={`items[${index}].unitPrice`}
                      aria-label={`Harga satuan item ${index + 1}`}
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(index, 'unitPrice', Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      id={`item-tax-${index}`}
                      name={`items[${index}].tax`}
                      aria-label={`Pajak item ${index + 1}`}
                      type="number"
                      min="0"
                      max="100"
                      value={item.tax}
                      onChange={(e) =>
                        handleItemChange(index, 'tax', Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                    {(subtotal + taxAmount).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      title="Hapus item"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Belum ada item. Klik "Tambah Item" untuk memulai.
        </div>
      )}
    </div>
  );
};

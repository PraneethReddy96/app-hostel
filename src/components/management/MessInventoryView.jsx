import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  UtensilsCrossed,
  Package,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Plus,
  RefreshCw,
  ShoppingBag,
  Download
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportCsv';

export const MessInventoryView = () => {
  const { messMenu, messInventory, updateDayMenu, updateInventoryStock, addToast } = useHostel();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'menu_editor' | 'expenses'
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingMealKey, setEditingMealKey] = useState('lunch');
  const [itemsText, setItemsText] = useState('');
  const [editTag, setEditTag] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMenu = messMenu[selectedDay] || messMenu['Monday'];

  const handleEditClick = (mealKey) => {
    setEditingMealKey(mealKey);
    const m = dayMenu[mealKey];
    setItemsText(m.items.join(', '));
    setEditTag(m.tag);
  };

  const handleSaveMenu = (e) => {
    e.preventDefault();
    updateDayMenu(selectedDay, editingMealKey, {
      items: itemsText.split(',').map(s => s.trim()).filter(Boolean),
      tag: editTag
    });
  };

  const handleQuickRestock = (itemId, itemName) => {
    updateInventoryStock(itemId, "150 kg", "Optimal");
    addToast(`Restock PO issued for ${itemName}. Stock restored to optimal.`, 'success', 'Inventory Restocked');
  };

  const messExpensesList = [
    { id: 'EXP-101', date: '2026-10-05', title: 'Vegetables & Produce', amount: 32400, vendor: 'Kisan Mandi Direct', status: 'Paid' },
    { id: 'EXP-102', date: '2026-10-10', title: 'Dairy & Milk Supply', amount: 28100, vendor: 'Amul Dairy Co', status: 'Paid' },
    { id: 'EXP-103', date: '2026-10-14', title: 'Rice, Atta & Pulses', amount: 24500, vendor: 'Agro Retail Mart', status: 'Paid' },
    { id: 'EXP-104', date: '2026-10-20', title: 'Chicken, Eggs & Fish', amount: 18200, vendor: 'Fresh Poultry Depot', status: 'Paid' },
    { id: 'EXP-105', date: '2026-10-25', title: 'Commercial LPG Cylinders', amount: 8800, vendor: 'Indane Gas Agency', status: 'Paid' }
  ];

  const handleDownloadInventoryCSV = () => {
    downloadCSV(
      `Mess_Pantry_Inventory_${new Date().toISOString().slice(0, 10)}.csv`,
      ['SKU ID', 'Ingredient / Item', 'Category', 'Current Stock', 'Min Alert Qty', 'Status', 'Supplier / Vendor', 'Last Purchased'],
      messInventory.map(i => [
        i.id,
        i.item,
        i.category,
        i.stockQty,
        i.minAlertQty,
        i.status,
        i.supplier,
        i.lastPurchased
      ])
    );
    addToast('Downloaded Mess Pantry Inventory CSV!', 'success', 'Inventory Exported');
  };

  const handleDownloadExpensesCSV = () => {
    downloadCSV(
      `Mess_Expenses_Ledger_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Expense ID', 'Date', 'Expense Category', 'Amount (INR)', 'Supplier / Vendor', 'Payment Status'],
      messExpensesList.map(e => [
        e.id,
        e.date,
        e.title,
        e.amount,
        e.vendor,
        e.status
      ])
    );
    addToast('Downloaded Monthly Mess Expenses Ledger CSV!', 'success', 'Expenses Exported');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Export Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mess Menu, Expenses & Inventory</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Weekly dining schedule editor, pantry warehouse stock alerts, and procurement ledgers
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleDownloadInventoryCSV}>
            <Download size={14} />
            <span>Download Inventory CSV</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleDownloadExpensesCSV}>
            <Download size={14} />
            <span>Download Expenses CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'inventory' ? 'var(--primary-gradient)' : 'transparent',
            color: activeTab === 'inventory' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Pantry Inventory ({messInventory.length})
        </button>
        <button
          onClick={() => setActiveTab('menu_editor')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'menu_editor' ? 'var(--primary-gradient)' : 'transparent',
            color: activeTab === 'menu_editor' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Weekly Menu Planner Editor
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            flex: 1,
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: 'none',
            background: activeTab === 'expenses' ? 'var(--primary-gradient)' : 'transparent',
            color: activeTab === 'expenses' ? 'white' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Mess Expense Ledger
        </button>
      </div>

      {/* 1. Inventory Tab */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>TRACKED ITEMS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{messInventory.length} SKUs</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Kitchen pantry & cold storage</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOW STOCK WARNINGS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>
                {messInventory.filter(i => i.status.includes('Low')).length} Items
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>Reorder required within 24h</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MONTHLY FOOD BUDGET</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>₹ 1,12,000</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg ₹133 / resident / day</div>
            </div>
          </div>

          {/* Inventory Stock Table */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Ingredient / Stock Item</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Alert Qty</th>
                  <th>Status</th>
                  <th>Supplier / Mandi</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {messInventory.map(item => {
                  const isLow = item.status.includes('Low');
                  return (
                    <tr key={item.id}>
                      <td><span style={{ fontWeight: 700 }}>{item.item}</span></td>
                      <td>{item.category}</td>
                      <td><span style={{ fontWeight: 800 }}>{item.stockQty}</span></td>
                      <td>{item.minAlertQty}</td>
                      <td>
                        <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.supplier}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                          onClick={() => handleQuickRestock(item.id, item.item)}
                        >
                          <RefreshCw size={11} />
                          <span>Restock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Menu Editor Tab */}
      {activeTab === 'menu_editor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Day Selector */}
          <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  border: selectedDay === d ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedDay === d ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                  color: selectedDay === d ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="responsive-grid-2">
            {/* Current Day Schedule */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['breakfast', 'lunch', 'snacks', 'dinner'].map(mKey => {
                const meal = dayMenu[mKey];
                if (!meal) return null;
                const isSelected = editingMealKey === mKey;

                return (
                  <div
                    key={mKey}
                    className="card"
                    style={{
                      borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleEditClick(mKey)}
                  >
                    <div className="card-header-flex">
                      <div>
                        <h4 style={{ textTransform: 'capitalize', fontSize: '0.95rem', fontWeight: 800 }}>{mKey}</h4>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{meal.time}</div>
                      </div>
                      <span className="badge badge-primary">{meal.tag}</span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.4rem' }}>
                      {meal.items.join(' • ')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Editor Form */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'capitalize' }}>
                Edit {selectedDay} {editingMealKey} Menu
              </h3>

              <form onSubmit={handleSaveMenu}>
                <div className="form-group">
                  <label className="form-label">MEAL TAG / THEME</label>
                  <input
                    className="form-control"
                    value={editTag}
                    onChange={e => setEditTag(e.target.value)}
                    placeholder="e.g. Chef's Special / Protein Rich"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">FOOD ITEMS (COMMA-SEPARATED)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={itemsText}
                    onChange={e => setItemsText(e.target.value)}
                    required
                  />
                  <small style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Changes immediately reflect on student food menus.
                  </small>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Save & Publish Menu
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Expenses Tab */}
      {activeTab === 'expenses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-header-flex" style={{ marginBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                Mess Procurement & Expenses Breakdown (October 2026)
              </h3>
              <button className="btn btn-primary btn-sm" onClick={handleDownloadExpensesCSV}>
                <Download size={14} />
                <span>Export Expenses Sheet (.csv)</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {messExpensesList.map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{exp.title}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0' }}>₹ {exp.amount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Vendor: {exp.vendor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

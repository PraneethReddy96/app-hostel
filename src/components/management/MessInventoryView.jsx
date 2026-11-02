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
  Download,
  Trash2,
  X
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportCsv';

const DEFAULT_PRICES = {
  'INV-01': 16200,
  'INV-02': 5880,
  'INV-03': 9100,
  'INV-04': 3200,
  'INV-05': 6400,
  'INV-06': 6160,
  'INV-07': 9450,
  'INV-08': 8750
};

export const MessInventoryView = () => {
  const {
    messMenu,
    messInventory,
    updateDayMenu,
    updateInventoryStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addToast
  } = useHostel();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'menu_editor' | 'expenses'
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingMealKey, setEditingMealKey] = useState('lunch');
  const [itemsText, setItemsText] = useState('');
  const [editTag, setEditTag] = useState('');

  // Add / Edit Inventory Modal State
  const [showInvModal, setShowInvModal] = useState(false);
  const [editingInvId, setEditingInvId] = useState(null);
  const [invForm, setInvForm] = useState({
    item: '',
    category: 'Grains & Rice',
    stockQty: '',
    minAlertQty: '',
    price: '',
    status: 'Optimal',
    supplier: ''
  });

  // Editable Mess Expenses Ledger State
  const [messExpensesList, setMessExpensesList] = useState([
    { id: 'EXP-101', date: '2026-10-05', title: 'Vegetables & Produce', amount: 32400, vendor: 'Kisan Mandi Direct', status: 'Paid' },
    { id: 'EXP-102', date: '2026-10-10', title: 'Dairy & Milk Supply', amount: 28100, vendor: 'Amul Dairy Co', status: 'Paid' },
    { id: 'EXP-103', date: '2026-10-14', title: 'Rice, Atta & Pulses', amount: 24500, vendor: 'Agro Retail Mart', status: 'Paid' },
    { id: 'EXP-104', date: '2026-10-20', title: 'Chicken, Eggs & Fish', amount: 18200, vendor: 'Fresh Poultry Depot', status: 'Paid' },
    { id: 'EXP-105', date: '2026-10-25', title: 'Commercial LPG Cylinders', amount: 8800, vendor: 'Indane Gas Agency', status: 'Paid' }
  ]);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState({
    title: '',
    amount: '',
    vendor: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Paid'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMenu = messMenu[selectedDay] || messMenu['Monday'];

  const getItemPrice = (item) => {
    if (item.price !== undefined && item.price !== null) return Number(item.price);
    return DEFAULT_PRICES[item.id] || 4500;
  };

  const totalInventoryValue = messInventory.reduce((sum, i) => sum + getItemPrice(i), 0);
  const totalExpensesAmount = messExpensesList.reduce((sum, e) => sum + Number(e.amount || 0), 0);

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

  // Inventory Modal Handlers
  const openAddInventoryModal = () => {
    setEditingInvId(null);
    setInvForm({
      item: '',
      category: 'Grains & Rice',
      stockQty: '150 kg',
      minAlertQty: '50 kg',
      price: '12500',
      status: 'Optimal',
      supplier: ''
    });
    setShowInvModal(true);
  };

  const openEditInventoryModal = (item) => {
    setEditingInvId(item.id);
    setInvForm({
      item: item.item,
      category: item.category,
      stockQty: item.stockQty,
      minAlertQty: item.minAlertQty,
      price: String(getItemPrice(item)),
      status: item.status,
      supplier: item.supplier
    });
    setShowInvModal(true);
  };

  const handleSaveInventory = (e) => {
    e.preventDefault();
    if (editingInvId) {
      updateInventoryItem(editingInvId, {
        item: invForm.item,
        category: invForm.category,
        stockQty: invForm.stockQty,
        minAlertQty: invForm.minAlertQty,
        price: Number(invForm.price) || 0,
        status: invForm.status,
        supplier: invForm.supplier
      });
    } else {
      addInventoryItem({
        item: invForm.item,
        category: invForm.category,
        stockQty: invForm.stockQty,
        minAlertQty: invForm.minAlertQty,
        price: Number(invForm.price) || 0,
        status: invForm.status,
        supplier: invForm.supplier
      });
    }
    setShowInvModal(false);
  };

  // Expense Modal Handlers
  const openAddExpenseModal = () => {
    setEditingExpId(null);
    setExpForm({
      title: '',
      amount: '',
      vendor: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'Paid'
    });
    setShowExpModal(true);
  };

  const openEditExpenseModal = (exp) => {
    setEditingExpId(exp.id);
    setExpForm({
      title: exp.title,
      amount: String(exp.amount),
      vendor: exp.vendor,
      date: exp.date,
      status: exp.status
    });
    setShowExpModal(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (editingExpId) {
      setMessExpensesList(prev =>
        prev.map(exp =>
          exp.id === editingExpId
            ? { ...exp, ...expForm, amount: Number(expForm.amount) || 0 }
            : exp
        )
      );
      addToast(`Updated expense "${expForm.title}".`, 'success', 'Expense Updated');
    } else {
      const newExp = {
        id: `EXP-${Math.floor(110 + Math.random() * 889)}`,
        ...expForm,
        amount: Number(expForm.amount) || 0
      };
      setMessExpensesList(prev => [newExp, ...prev]);
      addToast(`Added expense "${expForm.title}" (₹${Number(expForm.amount).toLocaleString()}).`, 'success', 'Expense Added');
    }
    setShowExpModal(false);
  };

  const handleDeleteExpense = (id, title) => {
    setMessExpensesList(prev => prev.filter(e => e.id !== id));
    addToast(`Deleted expense "${title}".`, 'warning', 'Expense Deleted');
  };

  const handleDownloadInventoryCSV = () => {
    downloadCSV(
      `Mess_Pantry_Inventory_${new Date().toISOString().slice(0, 10)}.csv`,
      ['SKU ID', 'Ingredient / Item', 'Category', 'Current Stock', 'Min Alert Qty', 'Stock Value (INR)', 'Status', 'Supplier / Vendor', 'Last Purchased'],
      messInventory.map(i => [
        i.id,
        i.item,
        i.category,
        i.stockQty,
        i.minAlertQty,
        getItemPrice(i),
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
      {/* Title & Action / Export Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mess Menu, Expenses & Inventory</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Add, edit, or delete pantry stock items & prices, manage weekly menus, and track expenses
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={openAddInventoryModal}>
            <Plus size={14} />
            <span>+ Add Inventory Item</span>
          </button>
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
          Mess Expense Ledger ({messExpensesList.length})
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
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Stock Value: ₹ {totalInventoryValue.toLocaleString()}</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOW STOCK WARNINGS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>
                {messInventory.filter(i => i.status.includes('Low')).length} Items
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>Click Edit on any item to update stock</div>
            </div>

            <div className="card">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MONTHLY MESS SPEND</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>₹ {totalExpensesAmount.toLocaleString()}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Across {messExpensesList.length} procurement bills</div>
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
                  <th>Price / Value (₹)</th>
                  <th>Min Alert Qty</th>
                  <th>Status</th>
                  <th>Supplier / Mandi</th>
                  <th>Actions (Edit / Delete)</th>
                </tr>
              </thead>
              <tbody>
                {messInventory.map(item => {
                  const isLow = item.status.includes('Low');
                  const itemPrice = getItemPrice(item);
                  return (
                    <tr key={item.id}>
                      <td><span style={{ fontWeight: 700 }}>{item.item}</span></td>
                      <td>{item.category}</td>
                      <td><span style={{ fontWeight: 800 }}>{item.stockQty}</span></td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          ₹ {itemPrice.toLocaleString()}
                        </span>
                      </td>
                      <td>{item.minAlertQty}</td>
                      <td>
                        <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.supplier}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                            onClick={() => openEditInventoryModal(item)}
                            title="Edit Stock Quantity, Price & Details"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 8px', color: 'var(--danger)' }}
                            onClick={() => deleteInventoryItem(item.id)}
                            title="Delete Inventory Item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
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
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                  Mess Procurement & Expenses Breakdown
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Total Spend: <strong>₹ {totalExpensesAmount.toLocaleString()}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={openAddExpenseModal}>
                  <Plus size={14} />
                  <span>+ Add Expense</span>
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleDownloadExpensesCSV}>
                  <Download size={14} />
                  <span>Export Expenses (.csv)</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {messExpensesList.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>{exp.title}</div>
                      <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>{exp.status}</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0', color: 'var(--primary)' }}>
                      ₹ {Number(exp.amount).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                      Vendor: {exp.vendor} • {exp.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.68rem', padding: '4px 8px' }}
                      onClick={() => openEditExpenseModal(exp)}
                    >
                      <Edit2 size={11} />
                      <span>Edit Price / Info</span>
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.68rem', padding: '4px 8px', color: 'var(--danger)' }}
                      onClick={() => handleDeleteExpense(exp.id, exp.title)}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Inventory Modal */}
      {showInvModal && (
        <div className="modal-backdrop" onClick={() => setShowInvModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                {editingInvId ? 'Edit Inventory Item & Price' : 'Add New Pantry Inventory Item'}
              </h3>
              <button className="icon-btn" onClick={() => setShowInvModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveInventory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">INGREDIENT / STOCK ITEM NAME *</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Aromatic Basmati Rice"
                    value={invForm.item}
                    onChange={e => setInvForm({ ...invForm, item: e.target.value })}
                    required
                  />
                </div>

                <div className="auth-form-grid">
                  <div className="form-group">
                    <label className="form-label">CATEGORY *</label>
                    <select
                      className="form-control"
                      value={invForm.category}
                      onChange={e => setInvForm({ ...invForm, category: e.target.value })}
                    >
                      <option value="Grains & Rice">Grains & Rice</option>
                      <option value="Grains & Flour">Grains & Flour</option>
                      <option value="Pulses">Pulses & Lentils</option>
                      <option value="Oils & Ghee">Oils & Ghee</option>
                      <option value="Dairy">Dairy & Milk</option>
                      <option value="Poultry">Poultry & Meat</option>
                      <option value="Vegetables">Vegetables & Produce</option>
                      <option value="Condiments">Condiments & Spices</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">STOCK STATUS</label>
                    <select
                      className="form-control"
                      value={invForm.status}
                      onChange={e => setInvForm({ ...invForm, status: e.target.value })}
                    >
                      <option value="Optimal">Optimal</option>
                      <option value="Low Stock Alert">Low Stock Alert</option>
                      <option value="Daily Delivery">Daily Delivery</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">CURRENT STOCK QUANTITY *</label>
                    <input
                      className="form-control"
                      placeholder="e.g. 150 kg or 50 Litres"
                      value={invForm.stockQty}
                      onChange={e => setInvForm({ ...invForm, stockQty: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">MIN ALERT QUANTITY *</label>
                    <input
                      className="form-control"
                      placeholder="e.g. 50 kg"
                      value={invForm.minAlertQty}
                      onChange={e => setInvForm({ ...invForm, minAlertQty: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PRICE / STOCK VALUE (₹ INR) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 16200"
                      value={invForm.price}
                      onChange={e => setInvForm({ ...invForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SUPPLIER / VENDOR *</label>
                    <input
                      className="form-control"
                      placeholder="e.g. Agro Foods Ltd"
                      value={invForm.supplier}
                      onChange={e => setInvForm({ ...invForm, supplier: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInvModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInvId ? 'Save Changes' : 'Add Item to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      {showExpModal && (
        <div className="modal-backdrop" onClick={() => setShowExpModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                {editingExpId ? 'Edit Mess Expense' : 'Add Mess Procurement Expense'}
              </h3>
              <button className="icon-btn" onClick={() => setShowExpModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">EXPENSE CATEGORY / TITLE *</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Rice, Atta & Pulses"
                    value={expForm.title}
                    onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="auth-form-grid">
                  <div className="form-group">
                    <label className="form-label">AMOUNT / PRICE (₹ INR) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 24500"
                      value={expForm.amount}
                      onChange={e => setExpForm({ ...expForm, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SUPPLIER / VENDOR *</label>
                    <input
                      className="form-control"
                      placeholder="e.g. Agro Retail Mart"
                      value={expForm.vendor}
                      onChange={e => setExpForm({ ...expForm, vendor: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">DATE</label>
                    <input
                      type="date"
                      className="form-control"
                      value={expForm.date}
                      onChange={e => setExpForm({ ...expForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PAYMENT STATUS</label>
                    <select
                      className="form-control"
                      value={expForm.status}
                      onChange={e => setExpForm({ ...expForm, status: e.target.value })}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending Invoice">Pending Invoice</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExpId ? 'Save Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

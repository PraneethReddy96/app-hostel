import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import {
  UtensilsCrossed,
  Clock,
  Flame,
  Star,
  Check,
  AlertTriangle,
  Smile,
  Leaf,
  Coffee,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

export const FoodMenuView = () => {
  const { messMenu, skippedMeals, toggleSkipMeal, addToast } = useHostel();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [ratingMeal, setRatingMeal] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMenu = messMenu[selectedDay] || messMenu['Monday'];

  const mealSlots = [
    { key: 'breakfast', label: 'Breakfast', icon: <Coffee size={16} />, color: '#f59e0b' },
    { key: 'lunch', label: 'Lunch', icon: <Sun size={16} />, color: '#10b981' },
    { key: 'snacks', label: 'Evening Snacks', icon: <Sunset size={16} />, color: '#06b6d4' },
    { key: 'dinner', label: 'Dinner', icon: <Moon size={16} />, color: '#8b5cf6' }
  ];

  const submitMealRating = (mealKey) => {
    addToast(`Thanks! Your ${ratingStars}⭐ rating for ${selectedDay} ${mealKey} was logged for the Mess Committee.`, 'success', 'Feedback Recorded');
    setRatingMeal(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hostel Dining & Food Menu</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Daily 4-meal nutritious schedule (Breakfast, Lunch, Snacks & Dinner)
        </p>
      </div>

      {/* Day Selector Pills */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                color: isSelected ? 'white' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Mess Timings Info Alert */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Leaf size={16} color="var(--success)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Dining Hall: Pure RO Water • Hygienic Kitchen • Zero Wastage Initiative
          </span>
        </div>
      </div>

      {/* 4 Meal Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mealSlots.map(({ key, label, icon, color }) => {
          const meal = dayMenu[key];
          if (!meal) return null;
          const skipKey = `${selectedDay}-${key}`;
          const isSkipped = !!skippedMeals[skipKey];

          return (
            <div
              key={key}
              className="card"
              style={{
                borderLeft: `4px solid ${color}`,
                opacity: isSkipped ? 0.65 : 1
              }}
            >
              <div className="card-header-flex">
                <div className="card-title">
                  <div className="card-title-icon" style={{ background: `${color}20`, color: color }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{meal.time}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ padding: '0.3rem 0.6rem' }}>
                    {meal.tag}
                  </span>
                </div>
              </div>

              {/* Calories */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Flame size={12} color="#f59e0b" />
                  <span>{meal.calories}</span>
                </span>
              </div>

              {/* Items List */}
              <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {meal.items.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
                      <span style={{ color: 'var(--text-main)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

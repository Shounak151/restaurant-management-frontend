import React from "react";

const CATEGORIES = ["All", "Starter", "Main Course", "Dessert", "Beverage"];

const CategoryTabs = ({ active, onChange }) => (
  <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-4 mb-2">
    {CATEGORIES.map((cat) => {
      const isActive = active === cat;
      return (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            isActive
              ? "bg-ink text-paper"
              : "bg-transparent text-ink/60 hover:text-ink border border-ink/15"
          }`}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export default CategoryTabs;

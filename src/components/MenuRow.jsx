import React from "react";
import { Link } from "react-router-dom";

const MenuRow = ({ item }) => {
  const outOfStock = item.availability === false;

  return (
    <Link
      to={`/menu/${item._id}`}
      className={`group flex items-start gap-4 py-5 px-1 sm:px-2 transition-colors hover:bg-gold/5 rounded-md ${
        outOfStock ? "opacity-50" : ""
      }`}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-md object-cover flex-shrink-0 border border-ink/10"
        />
      ) : (
        <div className="w-16 h-16 rounded-md flex-shrink-0 border border-ink/10 bg-paper-dim flex items-center justify-center text-ink/30 text-xs">
          No photo
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-lg text-ink group-hover:text-gold-dark transition-colors truncate">
            {item.name}
          </h3>
          <span className="menu-row-leader flex-1 hidden sm:block" />
          <span className="font-display text-lg text-ink whitespace-nowrap">
            ₹{Number(item.price).toFixed(0)}
          </span>
        </div>
        <p className="text-sm text-ink/60 mt-1 line-clamp-2 max-w-xl">{item.description}</p>
        {outOfStock && (
          <span className="inline-block mt-2 text-xs font-medium text-brick tracking-wide">
            Currently out of stock
          </span>
        )}
      </div>
    </Link>
  );
};

export default MenuRow;

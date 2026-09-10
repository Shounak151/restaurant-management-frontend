import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-24 border-t border-ink/10 bg-ink text-paper/70">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid gap-8 sm:grid-cols-3">
      <div>
        <p className="font-display text-xl text-paper">TastyBites</p>
        <p className="mt-2 text-sm max-w-xs">
          A neighbourhood kitchen serving honest plates, seven days a week.
        </p>
      </div>
      <div className="text-sm">
        <p className="text-paper mb-2 font-medium">Hours</p>
        <p>Mon – Sat, 11:00 – 22:30</p>
        <p>Sunday, 12:00 – 21:00</p>
      </div>
      <div className="text-sm">
        <p className="text-paper mb-2 font-medium">Explore</p>
        <div className="flex flex-col gap-1">
          <Link to="/menu" className="hover:text-paper transition-colors">Full menu</Link>
          <Link to="/admin/login" className="hover:text-paper transition-colors">Staff login</Link>
        </div>
      </div>
    </div>
    <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/40">
      TastyBites Restaurant Management System
    </div>
  </footer>
);

export default Footer;

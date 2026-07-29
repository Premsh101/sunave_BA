'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const inputClass =
  'w-full bg-black/20 border border-mk-outline rounded-xl px-4 py-3 text-sm text-mk-fg placeholder:text-mk-secondary/60 focus:outline-none focus:border-mk-primary focus:ring-1 focus:ring-mk-primary transition-colors';

const companySizes = ['1-50', '51-200', '201-1000', '1000+'];

export default function EnterpriseForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companySize, setCompanySize] = useState(companySizes[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <CheckCircle2 size={48} className="text-mk-primary mb-6" />
        <h3 className="font-display text-3xl text-mk-fg mb-3">Request received.</h3>
        <p className="text-mk-secondary font-light max-w-sm">
          Thanks{firstName ? `, ${firstName}` : ''} — our enterprise team will reach out to{' '}
          <span className="text-mk-fg">{email}</span> within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="ent-first-name" className="block text-xs text-mk-secondary uppercase tracking-widest mb-2">
            First Name
          </label>
          <input
            id="ent-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ent-last-name" className="block text-xs text-mk-secondary uppercase tracking-widest mb-2">
            Last Name
          </label>
          <input
            id="ent-last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="ent-email" className="block text-xs text-mk-secondary uppercase tracking-widest mb-2">
          Work Email
        </label>
        <input
          id="ent-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@company.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="ent-company-size" className="block text-xs text-mk-secondary uppercase tracking-widest mb-2">
          Company Size
        </label>
        <select
          id="ent-company-size"
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          {companySizes.map((size) => (
            <option key={size} value={size} className="bg-mk-surface text-mk-fg">
              {size}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-mk-primary text-white text-sm font-medium px-8 py-4 rounded-xl glow-button mt-2"
      >
        Submit Request
      </button>
    </form>
  );
}

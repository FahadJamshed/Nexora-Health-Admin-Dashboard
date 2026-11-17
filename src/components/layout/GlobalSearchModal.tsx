import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../ui/Icon';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    companies,
    insuredMembers,
    policies,
    claims,
    hospitals,
    settlements,
    invoices,
    navigate,
    setViewingItem,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);

  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    if (!inputVal.trim()) return [];
    const q = inputVal.toLowerCase();

    const matches: {
      type: string;
      category: string;
      title: string;
      subtitle: string;
      badge?: string;
      page: any;
      item: any;
    }[] = [];

    // Search Claims
    claims.forEach((c) => {
      if (
        c.claimNumber.toLowerCase().includes(q) ||
        c.memberName.toLowerCase().includes(q) ||
        c.hospitalName.toLowerCase().includes(q) ||
        c.diagnosis.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Claim',
          category: 'Insurance Operations',
          title: `${c.claimNumber} · ${c.memberName}`,
          subtitle: `${c.hospitalName} · PKR ${c.submittedAmount.toLocaleString()}`,
          badge: c.status,
          page: 'Claims Management',
          item: c,
        });
      }
    });

    // Search Members
    insuredMembers.forEach((m) => {
      if (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.ssn.includes(q) ||
        m.corporateClientName.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Member',
          category: 'People',
          title: `${m.name} (${m.id})`,
          subtitle: `${m.corporateClientName} · ${m.insurancePlanName}`,
          badge: m.status,
          page: 'Insured Members',
          item: m,
        });
      }
    });

    // Search Policies
    policies.forEach((p) => {
      if (
        p.policyNumber.toLowerCase().includes(q) ||
        p.memberName.toLowerCase().includes(q) ||
        p.planName.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Policy',
          category: 'Insurance Operations',
          title: `${p.policyNumber} · ${p.planName}`,
          subtitle: `${p.memberName} · ${p.insuranceCompanyName}`,
          badge: p.status,
          page: 'Policies',
          item: p,
        });
      }
    });

    // Search Companies & Hospitals
    companies.forEach((co) => {
      if (co.name.toLowerCase().includes(q) || co.city.toLowerCase().includes(q) || co.contactPerson.toLowerCase().includes(q)) {
        matches.push({
          type: co.type,
          category: 'Organizations',
          title: co.name,
          subtitle: `${co.city} · ${co.contactPerson}`,
          badge: co.status,
          page: 'All Companies',
          item: co,
        });
      }
    });

    hospitals.forEach((h) => {
      if (h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)) {
        matches.push({
          type: 'Hospital',
          category: 'Organizations',
          title: h.name,
          subtitle: `${h.city} · ${h.insuranceNetworks.join(', ')}`,
          badge: h.networkStatus,
          page: 'Hospitals & Clinics',
          item: h,
        });
      }
    });

    // Search Settlements
    settlements.forEach((s) => {
      if (s.settlementNumber.toLowerCase().includes(q) || s.hospitalName.toLowerCase().includes(q)) {
        matches.push({
          type: 'Settlement',
          category: 'Financial Management',
          title: `${s.settlementNumber} · ${s.hospitalName}`,
          subtitle: `Amount: PKR ${s.settlementAmount.toLocaleString()} · ${s.paymentMethod}`,
          badge: s.status,
          page: 'Settlements',
          item: s,
        });
      }
    });

    // Search Invoices
    invoices.forEach((inv) => {
      if (inv.invoiceNumber.toLowerCase().includes(q) || inv.vendorName.toLowerCase().includes(q)) {
        matches.push({
          type: 'Invoice',
          category: 'Financial Management',
          title: `${inv.invoiceNumber} · ${inv.vendorName}`,
          subtitle: `PKR ${inv.totalAmount.toLocaleString()} · Due: ${inv.dueDate}`,
          badge: inv.paymentStatus,
          page: 'Invoices & Payables',
          item: inv,
        });
      }
    });

    return matches.slice(0, 10);
  }, [inputVal, claims, insuredMembers, policies, companies, hospitals, settlements, invoices]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (result: (typeof results)[0]) => {
    navigate(result.page);
    setViewingItem({ type: result.type, item: result.item });
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#102A43]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E5EAF1] w-full max-w-2xl overflow-hidden z-10 animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5EAF1] gap-3">
          <Icon name="search" size={18} className="text-[#8A97A8] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search across companies, members, claims, policies, settlements..."
            className="w-full text-sm text-[#102A43] placeholder-[#8A97A8] focus:outline-none bg-transparent"
          />
          {inputVal && (
            <button
              onClick={() => {
                setInputVal('');
                setSearchQuery('');
              }}
              className="p-1 text-[#8A97A8] hover:text-[#172B4D]"
            >
              <Icon name="close" size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-[#8A97A8] bg-[#F1F4F9] border border-[#E5EAF1] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {inputVal.trim() === '' ? (
            <div className="py-8 px-4 text-center">
              <p className="text-xs font-semibold text-[#8A97A8] uppercase tracking-wider mb-3">Quick Navigation</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['Claims Management', 'Insured Members', 'Insurance Plans', 'Policies', 'Settlements', 'All Companies'].map((navTarget) => (
                  <button
                    key={navTarget}
                    onClick={() => {
                      navigate(navTarget as any);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] text-[#40516A] hover:bg-[#EAF2FF] hover:text-[#2776EA] transition-colors"
                  >
                    {navTarget}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8A97A8]">
                Found {results.length} results
              </div>
              {results.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectResult(res)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8FAFC] flex items-center justify-between gap-3 group transition-colors border border-transparent hover:border-[#E5EAF1]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#2776EA] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {res.type[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-[#102A43] truncate group-hover:text-[#2776EA] transition-colors">
                          {res.title}
                        </h4>
                        <span className="text-[10px] text-[#8A97A8] px-1.5 py-0.2 bg-[#F1F4F9] rounded">
                          {res.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#66758A] truncate mt-0.5">{res.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {res.badge && <Badge value={res.badge} size="sm" />}
                    <Icon name="chevron-right" size={14} className="text-[#8A97A8] group-hover:text-[#2776EA]" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F1F4F9] flex items-center justify-center text-[#8A97A8] mx-auto mb-2">
                <Icon name="search" size={18} />
              </div>
              <p className="text-xs font-semibold text-[#102A43]">No matches found for "{inputVal}"</p>
              <p className="text-[11px] text-[#8A97A8] mt-1">Try searching by ID, company name, SSN / ID, or status.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E5EAF1] flex items-center justify-between text-[11px] text-[#8A97A8]">
          <span>Tip: Press Cmd+K anywhere to search</span>
          <span>Nexora Enterprise Directory</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;

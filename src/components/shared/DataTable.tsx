import React, { useState, useMemo } from 'react';
import Icon from '../ui/Icon';
import Badge from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableAction<T> {
  label: string;
  icon?: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  variant?: 'default' | 'danger' | 'primary';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  searchKeys?: (keyof T)[];
  statusKey?: keyof T;
  statusOptions?: string[];
  extraFilters?: React.ReactNode;
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  actions?: DataTableAction<T>[];
  customActions?: DataTableAction<T>[];
  bulkActions?: { label: string; onClick: (selectedRows: T[]) => void }[];
  keyField?: keyof T;
  title?: string;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKey,
  searchKeys,
  statusKey,
  statusOptions,
  extraFilters,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  actions,
  customActions,
  bulkActions,
  keyField = 'id' as keyof T,
  title,
  pageSize = 10,
}: DataTableProps<T>) {
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());
  const [openMenuRowId, setOpenMenuRowId] = useState<any>(null);

  // Combine actions & customActions
  const combinedActions = useMemo(() => {
    return [...(actions || []), ...(customActions || [])];
  }, [actions, customActions]);

  // Normalize search keys
  const effectiveSearchKeys = useMemo(() => {
    if (searchKeys && searchKeys.length > 0) return searchKeys;
    if (searchKey) return [searchKey];
    return undefined;
  }, [searchKeys, searchKey]);

  // Derived filter options
  const derivedStatusOptions = useMemo(() => {
    if (statusOptions) return statusOptions;
    if (statusKey) {
      const set = new Set<string>();
      data.forEach((item) => {
        const val = item[statusKey];
        if (typeof val === 'string') set.add(val);
      });
      return ['All', ...Array.from(set)];
    }
    return ['All'];
  }, [data, statusKey, statusOptions]);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusKey && statusFilter !== 'All') {
        if (item[statusKey] !== statusFilter) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (effectiveSearchKeys && effectiveSearchKeys.length > 0) {
          const match = effectiveSearchKeys.some((k) =>
            String(item[k] || '')
              .toLowerCase()
              .includes(query)
          );
          if (!match) return false;
        } else {
          // Default: check all object values
          const str = Object.values(item).join(' ').toLowerCase();
          if (!str.includes(query)) return false;
        }
      }
      return true;
    });
  }, [data, statusKey, statusFilter, searchQuery, effectiveSearchKeys]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortField === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((d) => d[keyField]));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleRow = (id: any) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((d) => selectedIds.has(d[keyField]));

  const handleExportCSV = () => {
    if (sortedData.length === 0) {
      showToast('No Data', 'No records available to export.', 'info');
      return;
    }
    const headers = columns.map((c) => c.header).join(',');
    const rows = sortedData.map((row) =>
      columns.map((c) => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${(title || 'records').toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', `Exported ${sortedData.length} records to CSV file.`, 'success');
  };

  const handleRowClickTrigger = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (onView) {
      onView(row);
    }
  };

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-xl shadow-xs overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-[#E5EAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Icon
            name="search"
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A97A8]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E5EAF1] rounded-lg text-[#102A43] placeholder-[#8A97A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2776EA]/20 focus:border-[#2776EA] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A97A8] hover:text-[#172B4D]"
            >
              <Icon name="close" size={13} />
            </button>
          )}
        </div>

        {/* Right: Filters & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs (if applicable) */}
          {statusKey && derivedStatusOptions.length > 1 && (
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-0.5 rounded-lg border border-[#E5EAF1] overflow-x-auto max-w-xs sm:max-w-none">
              {derivedStatusOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setStatusFilter(opt);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                    statusFilter === opt
                      ? 'bg-white text-[#2776EA] font-semibold shadow-2xs'
                      : 'text-[#66758A] hover:text-[#172B4D]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Extra Custom Filters */}
          {extraFilters}

          {/* Bulk Action Controls */}
          {selectedIds.size > 0 && bulkActions && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#E5EAF1]">
              <span className="text-xs text-[#2776EA] font-semibold">
                {selectedIds.size} selected
              </span>
              {bulkActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const sel = data.filter((d) => selectedIds.has(d[keyField]));
                    action.onClick(sel);
                    setSelectedIds(new Set());
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#EAF2FF] text-[#2776EA] hover:bg-[#2776EA] hover:text-white transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] hover:bg-white text-xs font-medium text-[#40516A] hover:text-[#102A43] transition-colors"
          >
            <Icon name="download" size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[340px] pb-10">
        {paginatedData.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-[#E5EAF1] text-[#8A97A8] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#D0D9E4] text-[#2776EA] focus:ring-[#2776EA]/20"
                    aria-label="Select all rows"
                  />
                </th>

                {columns.map((col) => {
                  const isSorted = sortField === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      className={`py-3 px-3.5 select-none ${col.className || ''} ${
                        col.sortable !== false
                          ? 'cursor-pointer hover:text-[#102A43] transition-colors'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable !== false && (
                          <span className="text-[#8A97A8]/70 flex flex-col -space-y-1">
                            <Icon
                              name="chevron"
                              size={9}
                              className={`transition-transform ${
                                isSorted && sortDirection === 'desc'
                                  ? 'rotate-90 text-[#2776EA]'
                                  : isSorted
                                  ? '-rotate-90 text-[#2776EA]'
                                  : 'rotate-0 opacity-40'
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}

                <th className="py-3 px-3.5 text-right w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5EAF1]">
              {paginatedData.map((row, idx) => {
                const rowId = row[keyField];
                const isSelected = selectedIds.has(rowId);
                const isClickable = !!onRowClick || !!onView;

                // Visible row actions
                const visibleActions = combinedActions.filter((a) => (a.show ? a.show(row) : true));

                const isNearBottom = idx >= Math.max(1, paginatedData.length - 3);

                return (
                  <tr
                    key={String(rowId || idx)}
                    onClick={() => isClickable && handleRowClickTrigger(row)}
                    className={`hover:bg-[#F8FAFC] transition-colors group ${
                      isSelected ? 'bg-[#F2F6FD]' : ''
                    } ${isClickable ? 'cursor-pointer' : ''}`}
                  >
                    <td
                      className="py-3.5 px-3.5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(rowId)}
                        className="w-3.5 h-3.5 rounded border-[#D0D9E4] text-[#2776EA] focus:ring-[#2776EA]/20"
                        aria-label={`Select row ${idx + 1}`}
                      />
                    </td>

                    {columns.map((col) => (
                      <td key={col.key} className={`py-3.5 px-3.5 ${col.className || ''}`}>
                        {col.render ? (
                          col.render(row)
                        ) : col.key === 'status' || col.key.toLowerCase().includes('status') ? (
                          <Badge value={String(row[col.key] || 'Active')} />
                        ) : (
                          <span className="text-[#172B4D] font-normal">
                            {String(row[col.key] ?? '—')}
                          </span>
                        )}
                      </td>
                    ))}

                    <td
                      className="py-3.5 px-3.5 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {(onView || onRowClick) && (
                          <button
                            onClick={() => {
                              if (onView) onView(row);
                              else if (onRowClick) onRowClick(row);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#2776EA] hover:bg-[#EAF2FF] rounded transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        )}

                        {visibleActions.length > 0 && visibleActions[0] && (
                          <button
                            onClick={() => visibleActions[0].onClick(row)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#102A43] bg-[#F1F4F9] hover:bg-[#E5EAF1] rounded transition-colors cursor-pointer"
                          >
                            {visibleActions[0].label}
                          </button>
                        )}

                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuRowId(openMenuRowId === rowId ? null : rowId);
                            }}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-[#8A97A8] hover:text-[#172B4D] hover:bg-[#F1F4F9] transition-colors cursor-pointer"
                            aria-label="Row options"
                          >
                            <Icon name="more" size={14} />
                          </button>

                          {openMenuRowId === rowId && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setOpenMenuRowId(null)}
                              />
                              <div
                                className={`absolute right-0 ${
                                  isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                                } w-52 bg-white rounded-xl shadow-2xl border border-[#E5EAF1] py-1.5 z-50 animate-in fade-in zoom-in-95`}
                              >
                                {(onView || onRowClick) && (
                                  <button
                                    onClick={() => {
                                      setOpenMenuRowId(null);
                                      if (onView) onView(row);
                                      else if (onRowClick) onRowClick(row);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs text-[#102A43] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer font-semibold"
                                  >
                                    <Icon name="eye" size={14} className="text-[#2776EA]" />
                                    View Full Details
                                  </button>
                                )}
                                {onEdit && (
                                  <button
                                    onClick={() => {
                                      setOpenMenuRowId(null);
                                      onEdit(row);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                                  >
                                    <Icon name="edit" size={14} />
                                    Edit Record
                                  </button>
                                )}
                                {visibleActions.map((act, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      setOpenMenuRowId(null);
                                      act.onClick(row);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer ${
                                      act.variant === 'danger'
                                        ? 'text-[#D64545] hover:bg-[#FDECEC]'
                                        : 'text-[#40516A] hover:bg-[#F8FAFC]'
                                    }`}
                                  >
                                    {act.icon && <Icon name={act.icon} size={14} />}
                                    {act.label}
                                  </button>
                                ))}
                                <button
                                  onClick={() => {
                                    setOpenMenuRowId(null);
                                    const ref =
                                      row.id ||
                                      row.settlementNumber ||
                                      row.txNumber ||
                                      row.invoiceNumber ||
                                      row.claimNumber ||
                                      row.code ||
                                      row.name ||
                                      'Record';
                                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                      navigator.clipboard.writeText(String(ref));
                                    }
                                    showToast('Copied to Clipboard', `Reference ${ref} copied.`);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs text-[#40516A] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Icon name="copy" size={14} />
                                  Copy Reference ID
                                </button>
                                {onDelete && (
                                  <>
                                    <div className="border-t border-[#E5EAF1] my-1" />
                                    <button
                                      onClick={() => {
                                        setOpenMenuRowId(null);
                                        onDelete(row);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-xs text-[#D64545] hover:bg-[#FDECEC] flex items-center gap-2.5 cursor-pointer font-medium"
                                    >
                                      <Icon name="trash" size={14} />
                                      Delete Record
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center px-4">
            <div className="w-12 h-12 rounded-full bg-[#F1F4F9] flex items-center justify-center text-[#8A97A8] mb-3">
              <Icon name="search" size={22} />
            </div>
            <h4 className="text-sm font-semibold text-[#102A43]">No matching records found</h4>
            <p className="text-xs text-[#66758A] mt-1 max-w-sm">
              We couldn't find any results matching your search "{searchQuery}" or selected filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setCurrentPage(1);
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[#2776EA] bg-[#EAF2FF] text-[#2776EA] hover:bg-[#2776EA] hover:text-white transition-colors shadow-2xs"
            >
              Reset All Filters & Search
            </button>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 sm:p-4 border-t border-[#E5EAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#66758A]">
        <div>
          Showing <span className="font-semibold text-[#172B4D]">{paginatedData.length}</span> of{' '}
          <span className="font-semibold text-[#172B4D]">{sortedData.length}</span> records
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded-md border border-[#E5EAF1] bg-white text-[#40516A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#2776EA] text-white shadow-xs'
                    : 'border border-[#E5EAF1] bg-white text-[#40516A] hover:bg-[#F8FAFC]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded-md border border-[#E5EAF1] bg-white text-[#40516A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F8FAFC] transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;

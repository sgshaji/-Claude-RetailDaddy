import { useState, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { useMonthSummaries } from '../hooks/useDailySummary';
import { formatCurrency } from '../utils/currencyHelpers';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDateRange(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDate = firstDay.toISOString().split('T')[0];

  const lastDay = new Date(year, month + 1, 0);
  const endDate = lastDay.toISOString().split('T')[0];

  return { startDate, endDate, daysInMonth: lastDay.getDate() };
}

function formatShortCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatCurrency(amount);
}

export function Insights() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const monthSummaries = useMonthSummaries(viewYear, viewMonth);

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const { daysInMonth } = getMonthDateRange(viewYear, viewMonth);

  // Build a lookup from date string to summary
  const summaryMap = useMemo(() => {
    const map = {};
    if (monthSummaries) {
      monthSummaries.forEach(s => { map[s.date] = s; });
    }
    return map;
  }, [monthSummaries]);

  // Build daily rows with running totals
  const dailyRows = useMemo(() => {
    const rows = [];
    let runningSales = 0;
    let runningProfit = 0;
    let runningTxns = 0;

    const maxDay = isCurrentMonth ? today.getDate() : daysInMonth;

    for (let d = 1; d <= maxDay; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const summary = summaryMap[dateStr];
      const daySales = summary?.total_sales_amount || 0;
      const dayProfit = summary?.total_profit || 0;
      const dayTxns = summary?.sales_count || 0;

      runningSales += daySales;
      runningProfit += dayProfit;
      runningTxns += dayTxns;

      const dayOfWeek = new Date(viewYear, viewMonth, d).getDay();
      const isToday = isCurrentMonth && d === today.getDate();

      rows.push({
        day: d,
        dateStr,
        dayOfWeek: SHORT_DAYS[dayOfWeek],
        isSunday: dayOfWeek === 0,
        isToday,
        daySales,
        dayProfit,
        dayTxns,
        runningSales,
        runningProfit,
        runningTxns,
        hasSales: daySales > 0
      });
    }

    return rows;
  }, [viewYear, viewMonth, summaryMap, daysInMonth, isCurrentMonth]);

  // MTD totals from the last row
  const mtdSales = dailyRows.length > 0 ? dailyRows[dailyRows.length - 1].runningSales : 0;
  const mtdProfit = dailyRows.length > 0 ? dailyRows[dailyRows.length - 1].runningProfit : 0;
  const mtdTxns = dailyRows.length > 0 ? dailyRows[dailyRows.length - 1].runningTxns : 0;
  const mtdMargin = mtdSales > 0 ? ((mtdProfit / mtdSales) * 100).toFixed(1) : '0.0';

  return (
    <Layout title="Monthly Sales">
      <div className="flex flex-col h-full">
        {/* Sticky month header */}
        <div className="sticky top-0 z-10 bg-gray-100">
          {/* Month Navigator */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <button
              onClick={goToPrevMonth}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow active:scale-95 transition-transform"
              aria-label="Previous month"
            >
              <span className="text-lg text-gray-700">&larr;</span>
            </button>

            <button
              onClick={goToCurrentMonth}
              className="text-center"
            >
              <h2 className="text-lg font-bold text-gray-900">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              {!isCurrentMonth && (
                <p className="text-xs text-primary-600 font-medium">Tap for current month</p>
              )}
            </button>

            <button
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-white shadow transition-transform ${
                isCurrentMonth ? 'opacity-30' : 'active:scale-95'
              }`}
              aria-label="Next month"
            >
              <span className="text-lg text-gray-700">&rarr;</span>
            </button>
          </div>

          {/* MTD Summary Cards */}
          <div className="grid grid-cols-3 gap-2 px-3 pb-2">
            <div className="bg-white rounded-lg px-2 py-2 text-center shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">MTD Sales</p>
              <p className="text-sm font-bold text-primary-600 mt-0.5">{formatShortCurrency(mtdSales)}</p>
            </div>
            <div className="bg-white rounded-lg px-2 py-2 text-center shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">MTD Profit</p>
              <p className="text-sm font-bold text-green-600 mt-0.5">{formatShortCurrency(mtdProfit)}</p>
            </div>
            <div className="bg-white rounded-lg px-2 py-2 text-center shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Margin</p>
              <p className="text-sm font-bold text-amber-600 mt-0.5">{mtdMargin}%</p>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[52px_1fr_1fr] gap-0 px-3 pb-1.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase">Day</div>
            <div className="text-center">
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Daily</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-semibold text-primary-400 uppercase">Running Total</span>
            </div>
          </div>
        </div>

        {/* Scrollable daily rows */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain px-3 pb-4 scrollbar-hide">
          {dailyRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-lg">No data for this month</p>
            </div>
          ) : (
            <div className="space-y-1">
              {dailyRows.map((row) => (
                <div
                  key={row.day}
                  className={`grid grid-cols-[52px_1fr_1fr] gap-0 items-center rounded-lg py-2.5 px-1 transition-colors ${
                    row.isToday
                      ? 'bg-primary-50 border border-primary-200'
                      : row.hasSales
                        ? 'bg-white'
                        : 'bg-gray-50'
                  } ${row.isSunday ? 'opacity-60' : ''}`}
                >
                  {/* Day column */}
                  <div className="flex flex-col items-center">
                    <span className={`text-base font-bold ${
                      row.isToday ? 'text-primary-600' : 'text-gray-800'
                    }`}>
                      {row.day}
                    </span>
                    <span className={`text-[10px] ${
                      row.isToday ? 'text-primary-500 font-semibold' : row.isSunday ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {row.isToday ? 'Today' : row.dayOfWeek}
                    </span>
                  </div>

                  {/* Daily sales & profit */}
                  <div className="text-center border-r border-gray-100 pr-2">
                    {row.hasSales ? (
                      <>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatCurrency(row.daySales)}
                        </p>
                        <p className="text-[11px] text-green-600">
                          +{formatCurrency(row.dayProfit)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-300">&mdash;</p>
                    )}
                  </div>

                  {/* Running MTD totals */}
                  <div className="text-center pl-2">
                    <p className={`text-sm font-bold ${
                      row.isToday ? 'text-primary-700' : 'text-gray-700'
                    }`}>
                      {formatShortCurrency(row.runningSales)}
                    </p>
                    <p className={`text-[11px] font-medium ${
                      row.isToday ? 'text-green-600' : 'text-green-500'
                    }`}>
                      +{formatShortCurrency(row.runningProfit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

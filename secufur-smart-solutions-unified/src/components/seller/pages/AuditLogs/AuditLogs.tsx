import React from 'react';
import { useApp } from '@/context/seller/AppContext';
import { ShieldCheck, History, Fingerprint, AlertTriangle, Info } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const { logs } = useApp();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 text-red-600 border-red-100';
      case 'Warning': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-green-50 text-green-600 border-green-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Order': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Financial': return 'bg-green-50 text-green-600 border-green-100';
      case 'Product': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Auth': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Settings': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'Compliance': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-jakarta font-extrabold text-slate-800">Regulatory Audit Trail</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Immutable records of all administrative and financial actions.</p>
        </div>
        <div className="flex items-center gap-2 text-[#002366] bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-[10px] font-extrabold uppercase">
          <Fingerprint size={16} /> SESSION ENCRYPTED
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-4 sm:px-8 py-4">Timestamp</th>
                <th className="px-4 sm:px-6 py-4">Context</th>
                <th className="px-4 sm:px-6 py-4">Operation</th>
                <th className="px-4 sm:px-6 py-4 hidden md:table-cell">Details (PII Masked)</th>
                <th className="px-4 sm:px-6 py-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700">{log.timestamp}</p>
                      {log.userName && (
                        <p className="text-[9px] text-slate-400 mt-1">By: {log.userName}</p>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className={`px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase border ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{log.action}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 hidden md:table-cell">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium font-mono max-w-xs truncate">{log.details}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase px-2 py-1 rounded-md border w-fit ${getSeverityColor(log.severity)}`}>
                        {log.severity === 'Critical' ? <AlertTriangle size={10} /> : 
                         log.severity === 'Warning' ? <Info size={10} /> : 
                         <ShieldCheck size={10} />}
                        {log.severity}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 sm:py-24 text-center">
                    <History className="mx-auto mb-4 opacity-10 text-[#002366]" size={40} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for system activity...</p>
                    <p className="text-slate-300 text-[10px] mt-2">Actions will be logged here automatically</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;

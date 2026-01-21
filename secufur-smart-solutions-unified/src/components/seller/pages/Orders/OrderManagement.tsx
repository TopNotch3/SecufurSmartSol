import React, { useState } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { 
  CheckCircle2, Truck, Download, ShieldCheck, Package, X, Star, ChevronRight, Info,
  Clock, AlertTriangle, Eye, MapPin, Phone, Mail
} from 'lucide-react';
import { OrderStatus, DeliveryPartner } from '../../types';

const OrderManagement: React.FC = () => {
  const { orders, acceptOrder, updateOrderStatus, shipOrder, seller } = useApp();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
  const [isInvoiceModal, setIsInvoiceModal] = useState<string | null>(null);
  const [isCourierModal, setIsCourierModal] = useState<string | null>(null);
  const [isOrderDetailModal, setIsOrderDetailModal] = useState<string | null>(null);

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);
  const enabledPartners = seller?.deliveryPreferences?.filter(p => p.isEnabled) || [];

  const handleShipOrder = (orderId: string, partner: DeliveryPartner) => {
    const trackingId = partner.name.substring(0, 3).toUpperCase() + Math.floor(10000000 + Math.random() * 90000000);
    shipOrder(orderId, partner.name, trackingId);
    setIsCourierModal(null);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Accepted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Packed': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Shipped': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const selectedOrder = orders.find(o => o.id === isOrderDetailModal);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-jakarta font-extrabold text-slate-800">Order Management</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Review orders and dispatch via your preferred couriers.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          {['All', 'Pending', 'Accepted', 'Shipped', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-extrabold transition-all uppercase whitespace-nowrap ${
                activeTab === tab ? 'bg-[#002366] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isOverdue = order.status === 'Pending' && new Date(order.slaDeadlines.acceptBy) < new Date();
          
          return (
            <div key={order.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:border-blue-200 ${isOverdue ? 'border-red-200' : 'border-gray-100'}`}>
              {isOverdue && (
                <div className="px-6 py-2 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-600 text-[10px] font-bold">
                  <AlertTriangle size={12} /> SLA VIOLATION - Accept immediately
                </div>
              )}
              <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                <div className="flex gap-3 sm:gap-4 items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#002366] font-bold border border-gray-100">
                    <Package size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-jakarta font-bold text-slate-800 text-sm sm:text-base">#{order.id}</h4>
                      {order.shipping?.provider && (
                        <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-bold uppercase">
                          {order.shipping.provider}
                        </span>
                      )}
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.paymentMethod === 'Prepaid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{order.customerName}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.date}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-wrap gap-2 sm:gap-3">
                  <div className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase border h-fit ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  {order.shipping?.trackingNumber && (
                    <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <span className="font-bold text-slate-800">{order.shipping.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-right">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Total</p>
                    <p className="text-base sm:text-lg font-jakarta font-extrabold text-slate-800">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsOrderDetailModal(order.id)}
                      className="p-2 sm:p-3 bg-gray-50 text-slate-400 rounded-xl border border-gray-100 hover:text-[#002366] hover:border-[#002366] transition-all"
                    >
                      <Eye size={16} />
                    </button>
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => acceptOrder(order.id)}
                        className="bg-green-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-xl font-bold text-[10px] sm:text-xs flex items-center gap-2 hover:bg-green-600 shadow-lg active:scale-95"
                      >
                        <CheckCircle2 size={14} /> ACCEPT
                      </button>
                    )}
                    {order.status === 'Accepted' && (
                      <button 
                        onClick={() => setIsCourierModal(order.id)}
                        className="bg-[#002366] text-white px-4 sm:px-5 py-2 sm:py-3 rounded-xl font-bold text-[10px] sm:text-xs flex items-center gap-2 hover:bg-blue-900 shadow-lg shadow-blue-900/20 active:scale-95"
                      >
                        <Truck size={14} /> SHIP
                      </button>
                    )}
                    <button 
                      onClick={() => setIsInvoiceModal(order.id)}
                      className="p-2 sm:p-3 bg-white border border-gray-200 text-slate-400 rounded-xl hover:text-[#002366] hover:border-[#002366] transition-all"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 sm:p-20 text-center">
            <Package className="mx-auto mb-4 text-gray-300" size={40} />
            <p className="text-lg font-bold text-slate-800 mb-2">No orders found</p>
            <p className="text-sm text-slate-400">
              {activeTab === 'All' ? 'Orders will appear here when customers place them' : `No ${activeTab.toLowerCase()} orders`}
            </p>
          </div>
        )}
      </div>

      {/* Courier Selection Modal */}
      {isCourierModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 sticky top-0">
              <div>
                <h3 className="text-lg sm:text-xl font-jakarta font-black text-[#002366] uppercase">Select Courier</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Order: #{isCourierModal}</p>
              </div>
              <button onClick={() => setIsCourierModal(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              {enabledPartners.length > 0 ? (
                enabledPartners.map(partner => (
                  <button 
                    key={partner.id}
                    onClick={() => handleShipOrder(isCourierModal, partner)}
                    className="w-full p-4 sm:p-5 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-[#002366] hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#002366] text-white rounded-xl flex items-center justify-center font-black text-[10px]">
                        {partner.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{partner.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                            <Star size={10} fill="currentColor" /> {partner.rating}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Pickup ~2 hrs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-right">
                        <p className="text-xs font-black text-[#002366]">₹{partner.baseRate + 15}</p>
                        <p className="text-[8px] font-bold text-green-600 uppercase">Insured</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-[#002366]" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-10 bg-orange-50 rounded-3xl border border-orange-100 p-8">
                  <Info className="mx-auto mb-4 text-orange-400" size={32} />
                  <p className="text-sm font-bold text-orange-800 mb-2">No Delivery Partners Enabled</p>
                  <p className="text-xs text-orange-600 mb-6">Enable couriers in Settings to dispatch orders.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {isOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 sticky top-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#002366]">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setIsOrderDetailModal(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Customer Details</h4>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-800">{selectedOrder.customerName}</p>
                  {selectedOrder.customerEmail && (
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Mail size={12} /> {selectedOrder.customerEmail}
                    </p>
                  )}
                  {selectedOrder.customerPhone && (
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Phone size={12} /> {selectedOrder.customerPhone}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 flex items-start gap-2">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span>
                      {selectedOrder.shippingAddress.line1}, {selectedOrder.shippingAddress.city}, 
                      {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">₹{item.price} × {item.quantity}</p>
                        <p className="text-[10px] text-slate-400">GST {item.gstRate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#002366]/5 p-4 sm:p-6 rounded-2xl">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">GST</span>
                    <span className="font-bold">₹{selectedOrder.gstTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-bold">₹{selectedOrder.shippingCharge}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="font-extrabold text-[#002366] text-lg">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Order Timeline</h4>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${idx === 0 ? 'bg-[#002366]' : 'bg-gray-300'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{event.status}</p>
                        <p className="text-[10px] text-slate-400">{new Date(event.timestamp).toLocaleString('en-IN')}</p>
                        {event.note && <p className="text-xs text-slate-500 mt-1">{event.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setIsOrderDetailModal(null)} 
                className="w-full py-4 bg-[#002366] text-white rounded-2xl font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#002366]">GST TAX INVOICE</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">Order: #{isInvoiceModal}</p>
              </div>
              <ShieldCheck className="text-green-500" size={32} />
            </div>
            <div className="p-8 sm:p-10">
              <div className="bg-blue-50 p-6 rounded-2xl text-[#002366] font-jakarta font-extrabold text-center mb-10">
                PRO-SECURE INVOICE GENERATED
              </div>
              <button onClick={() => setIsInvoiceModal(null)} className="w-full py-4 bg-[#002366] text-white rounded-2xl font-bold text-xs uppercase">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

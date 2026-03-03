"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { products as allProducts } from "@/lib/mockData";
import type { Product, SaleItem } from "@/lib/types";
import {
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard,
  Smartphone, Banknote, Printer, X, CheckCircle, Barcode,
  Tag, ChevronDown, Menu, Settings
} from "lucide-react";

const categories = ["All", "Flour & Grains", "Cooking Oils", "Sugar & Sweeteners", "Dairy", "Bakery", "Medicines", "Building Materials", "Hardware", "Beverages", "Detergents"];

export default function POSPage() {
  const [search, setSearch] = useState("");
  // Load business settings for receipt
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState({ name: "LEXINTEL POS", address: "Main Branch" });

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("lexintel-settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.businessLogo) setBusinessLogo(settings.businessLogo);
        if (settings.businessInfo) setBusinessInfo({
          name: settings.businessInfo.name || "LEXINTEL POS",
          address: settings.businessInfo.address || "Main Branch"
        });
      } catch {}
    }
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "M-Pesa">("Cash");
  const [customerName, setCustomerName] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedSale, setCompletedSale] = useState<{ id: string; total: number; method: string } | null>(null);
  const [showCart, setShowCart] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [cashReceived, setCashReceived] = useState("");

  const filteredProducts = allProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      const vatAmount = (product.sellingPrice * product.vatRate) / (100 + product.vatRate);
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.sellingPrice,
          vatAmount,
          totalPrice: product.sellingPrice,
        },
      ];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + delta, totalPrice: (i.quantity + delta) * i.unitPrice }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalVat = cartItems.reduce((sum, i) => sum + i.vatAmount * i.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const change = parseFloat(cashReceived || "0") - total;

  const completeSale = () => {
    if (cartItems.length === 0) return;
    const saleId = `S-${Date.now().toString().slice(-6)}`;
    setCompletedSale({ id: saleId, total, method: paymentMethod });
    setShowReceipt(true);
  };

  const newSale = () => {
    setCartItems([]);
    setDiscount(0);
    setCustomerName("");
    setCashReceived("");
    setShowReceipt(false);
    setCompletedSale(null);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      // In a real app, this would be saved to the database
      alert(`Category "${newCategory}" will be added! (Demo only - data not persisted)`);
      setNewCategory("");
      setShowCategoryModal(false);
    }
  };

  const printReceipt = () => {
    // Create a clean print window for the receipt
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${completedSale?.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; padding: 10px; }
          .receipt { max-width: 280px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 15px; }
          .header h1 { font-size: 16px; margin-bottom: 5px; }
          .header p { font-size: 10px; color: #666; }
          .logo { max-width: 80px; max-height: 40px; margin-bottom: 10px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .item-name { flex: 1; }
          .item-qty { width: 30px; text-align: center; }
          .item-price { width: 60px; text-align: right; }
          .total { font-weight: bold; font-size: 14px; margin-top: 10px; }
          .change { margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            ${businessLogo ? `<img src="${businessLogo}" alt="Logo" class="logo" />` : ''}
            <h1>LEXINTEL POS</h1>
            <p>Main Branch · Nairobi</p>
            <p>${new Date().toLocaleString('en-KE')}</p>
          </div>
          <div class="divider"></div>
          ${cartItems.map(item => `
            <div class="item">
              <span class="item-name">${item.productName} x${item.quantity}</span>
              <span class="item-price">KES ${item.totalPrice.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="item">
            <span>VAT (16%)</span>
            <span>KES ${totalVat.toFixed(2)}</span>
          </div>
          ${discountAmount > 0 ? `
          <div class="item" style="color: green;">
            <span>Discount</span>
            <span>-KES ${discountAmount.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total">
            <div class="item">
              <span>TOTAL</span>
              <span>KES ${total.toFixed(2)}</span>
            </div>
          </div>
          <div class="item">
            <span>Payment</span>
            <span>${paymentMethod}</span>
          </div>
          ${paymentMethod === "Cash" && change >= 0 ? `
          <div class="change">
            <div class="item">
              <span>Cash Received</span>
              <span>KES ${Number(cashReceived).toFixed(2)}</span>
            </div>
            <div class="item">
              <span>CHANGE</span>
              <span>KES ${change.toFixed(2)}</span>
            </div>
          </div>
          ` : ''}
          <div class="divider"></div>
          <div class="footer">
            <p>Ref: ${completedSale?.id}</p>
            <p>Thank you for shopping with us!</p>
            <p>www.forbesa.co.ke</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Open a new window with the receipt content
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  // Barcode Scanner Function
  const handleBarcodeScan = async () => {
    // Check if BarcodeDetector API is available (Chrome/Edge)
    if ("BarcodeDetector" in window) {
      try {
        // @ts-ignore - BarcodeDetector is not in TypeScript types yet
        const barcodeDetector = new window.BarcodeDetector({
          formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e"]
        });
        
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        // Create video element for scanning
        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.play();
        
        // Create a scanning indicator
        const scanningMsg = alert("Point camera at barcode. Press OK when done, or wait 10 seconds.");
        
        // Try to detect barcode for 10 seconds
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Scan timeout")), 10000)
        );
        
        const detectPromise = (async () => {
          while (true) {
            try {
              const barcodes = await barcodeDetector.detect(video);
              if (barcodes.length > 0) {
                const barcode = barcodes[0].rawValue;
                stream.getTracks().forEach(track => track.stop());
                // Search for product with this barcode
                setSearch(barcode);
                return;
              }
            } catch {
              // Continue scanning
            }
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        })();
        
        await Promise.race([detectPromise, timeoutPromise]);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        // Fall back to manual input
        alert("Camera access failed or not available. Please use the search bar to enter barcode manually, or use a USB barcode scanner.");
      }
    } else {
      // BarcodeDetector not supported - prompt for manual input
      const manualBarcode = prompt("Enter barcode manually (or use USB barcode scanner - it will type automatically):");
      if (manualBarcode) {
        setSearch(manualBarcode);
      }
    }
  };

  return (
    <div>
      <TopBar title="Point of Sale" subtitle="Fast checkout processing" />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Products Panel */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {/* Search & Filter */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, barcode, or SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button 
              onClick={handleBarcodeScan}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              <Barcode size={16} />
              Scan
            </button>
            <button 
              onClick={() => setShowCart(!showCart)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              <ShoppingCart size={16} />
              <span className="badge bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItems.length}</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
                style={selectedCategory === cat ? { backgroundColor: "#1a3a5c" } : {}}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
            >
              <Plus size={12} />
              Add Category
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const inCart = cartItems.find((i) => i.productId === product.id);
                const isLowStock = product.quantity <= product.reorderLevel;
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`bg-white rounded-xl p-3 text-left border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      inCart ? "border-sky-400 ring-1 ring-sky-400" : "border-slate-100"
                    } ${product.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={product.quantity === 0}
                  >
                    <div className="w-full h-16 bg-slate-100 rounded-lg mb-2 flex items-center justify-center">
                      <Tag size={24} className="text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{product.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold" style={{ color: "#1a3a5c" }}>
                        KES {product.sellingPrice}
                      </span>
                      {isLowStock && (
                        <Badge variant="warning">Low</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Stock: {product.quantity}</p>
                    {inCart && (
                      <div className="mt-1.5 text-xs font-medium text-sky-600">
                        In cart: {inCart.quantity}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <div className={`${showCart ? 'block' : 'hidden'} lg:block w-full sm:w-80 md:w-80 lg:w-80 xl:w-96 bg-white border-l border-slate-200 flex flex-col fixed lg:relative right-0 top-0 h-full lg:h-auto z-40 lg:z-auto`}>
          {/* Mobile Cart Header with Close */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Current Sale</h3>
            <button onClick={() => setShowCart(false)} className="p-1 hover:bg-slate-100 rounded">
              <X size={20} />
            </button>
          </div>
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} style={{ color: "#1a3a5c" }} />
                <h3 className="font-semibold text-slate-800">Current Sale</h3>
              </div>
              <Badge variant="info">{cartItems.length} items</Badge>
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name (optional)"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart size={40} className="text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm">Cart is empty</p>
                <p className="text-slate-300 text-xs mt-1">Click products to add them</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.productId} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800 flex-1 leading-tight">{item.productName}</p>
                    <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">KES {item.totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">@ {item.unitPrice}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          <div className="p-4 border-t border-slate-100 space-y-3">
            {/* Discount */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 flex-shrink-0">Discount %</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                min="0"
                max="100"
              />
            </div>

            {/* Totals */}
            <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>VAT</span>
                <span>KES {totalVat.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount ({discount}%)</span>
                  <span>-KES {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-slate-800 pt-1.5 border-t border-slate-200">
                <span>TOTAL</span>
                <span>KES {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {(["Cash", "M-Pesa", "Card"] as const).map((method) => {
                  const Icon = method === "Cash" ? Banknote : method === "M-Pesa" ? Smartphone : CreditCard;
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                        paymentMethod === method
                          ? "border-sky-500 text-sky-700 bg-sky-50"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} />
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash received */}
            {paymentMethod === "Cash" && (
              <div>
                <label className="text-xs font-medium text-slate-600">Cash Received</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full mt-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {cashReceived && change >= 0 && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    Change: KES {change.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Complete Sale Button */}
            <button
              onClick={completeSale}
              disabled={cartItems.length === 0}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: "#1a3a5c" }}
            >
              <CheckCircle size={16} />
              Complete Sale · KES {total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && completedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => {
          if (e.target === e.currentTarget) setShowReceipt(false);
        }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="p-6 text-center border-b border-slate-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Sale Complete!</h3>
              <p className="text-slate-500 text-sm mt-1">Transaction processed successfully</p>
            </div>

            <div className="p-6 space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm space-y-2">
                <div className="text-center mb-3">
                  <p className="font-bold text-lg">LEXINTEL POS</p>
                  <p className="text-xs text-slate-500">Main Branch · Nairobi</p>
                  <p className="text-xs text-slate-400">{new Date().toLocaleString("en-KE")}</p>
                </div>
                <div className="border-t border-dashed border-slate-300 pt-2">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>KES {item.totalPrice}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>VAT</span><span>KES {totalVat.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600">
                      <span>Discount</span><span>-KES {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>TOTAL</span><span>KES {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Payment</span><span>{completedSale.method}</span>
                  </div>
                  {paymentMethod === "Cash" && change >= 0 && (
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Change</span><span>KES {change.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="text-center text-xs text-slate-400 pt-2 border-t border-dashed border-slate-300">
                  Ref: {completedSale.id} · Thank you!
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={printReceipt}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Printer size={15} />
                  Print
                </button>
                <button
                  onClick={newSale}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ backgroundColor: "#1a3a5c" }}
                >
                  New Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => {
          if (e.target === e.currentTarget) setShowCategoryModal(false);
        }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Manage Categories/Departments</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Add New Category</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Existing Categories</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <div key={cat} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">{cat}</span>
                      <button className="text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400">Note: Categories need to be saved to the database for persistence.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

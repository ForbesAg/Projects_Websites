"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  BookOpen,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronRight,
  CheckCircle,
  Play,
  Search,
  Barcode,
  DollarSign,
  FileText,
  Truck,
  Shield,
  Award,
  Clock,
  Target,
  Lightbulb,
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  tips?: string[];
}

const trainingModules: Module[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of the Lexintel POS System",
    icon: BookOpen,
    duration: "10 min",
    lessons: [
      {
        id: "gs-login",
        title: "Logging In",
        content: "Enter your email and password on the login page. If this is your first time, use the default admin credentials provided by your administrator.",
        tips: [
          "Bookmark the login page for quick access",
          "Use 'Remember me' for convenience (not recommended on shared computers)",
        ],
      },
      {
        id: "gs-interface",
        title: "Understanding the Interface",
        content: "The sidebar on the left contains all navigation menus. The top bar shows your current location and user info. The main area displays content and data.",
        tips: [
          "Click on any menu item to navigate",
          "The sidebar shows only modules your role can access",
        ],
      },
      {
        id: "gs-password",
        title: "Changing Your Password",
        content: "Go to the Training module to learn about password management, or click on your profile in the sidebar to change your password.",
        tips: [
          "Choose a strong password with uppercase, lowercase, and numbers",
          "Never share your password with others",
        ],
      },
    ],
  },
  {
    id: "pos-training",
    title: "Point of Sale",
    description: "Master the checkout process",
    icon: ShoppingCart,
    duration: "15 min",
    lessons: [
      {
        id: "pos-search",
        title: "Finding Products",
        content: "Use the search bar to find products by name, SKU, or barcode. You can also filter by category using the category buttons.",
        tips: [
          "Type product name for quick results",
          "Use barcode scanner for faster checkout",
        ],
      },
      {
        id: "pos-add",
        title: "Adding Items to Cart",
        content: "Click on any product card to add it to the cart. Use the +/- buttons to adjust quantities. Click the X to remove an item.",
        tips: [
          "Clicking the same product twice adds more quantity",
          "You can see current stock before adding",
        ],
      },
      {
        id: "pos-discount",
        title: "Applying Discounts",
        content: "Enter a discount percentage in the discount field. The system automatically calculates the new total.",
        tips: [
          "Discounts reduce the subtotal before VAT",
          "Managers can approve higher discounts",
        ],
      },
      {
        id: "pos-payment",
        title: "Payment Processing",
        content: "Select payment method (Cash, M-Pesa, or Card). For cash, enter amount received and the system calculates change.",
        tips: [
          "Always confirm amount received before completing sale",
          "Print or email receipt to customer",
        ],
      },
    ],
  },
  {
    id: "inventory-training",
    title: "Inventory Management",
    description: "Manage your products and stock",
    icon: Package,
    duration: "20 min",
    lessons: [
      {
        id: "inv-view",
        title: "Viewing Products",
        content: "The inventory page shows all products with their stock levels. Use search and filters to find specific items.",
        tips: [
          "Red items are low stock",
          "Sort by clicking column headers",
        ],
      },
      {
        id: "inv-add",
        title: "Adding New Products",
        content: "Click 'Add Product' to create new items. Fill in name, SKU, barcode, prices, and stock details.",
        tips: [
          "Use unique SKUs for each product",
          "Set reorder levels to get low stock alerts",
        ],
      },
      {
        id: "inv-update",
        title: "Updating Stock",
        content: "Click on a product to edit its details. Update quantities to reflect stock received or adjustments.",
        tips: [
          "Track inventory regularly",
          "Check expiry dates for perishable items",
        ],
      },
    ],
  },
  {
    id: "users-training",
    title: "User Management",
    description: "Managing staff accounts (Admin only)",
    icon: Users,
    duration: "15 min",
    lessons: [
      {
        id: "user-roles",
        title: "Understanding Roles",
        content: "Four roles: Admin (full access), Manager (operations), Cashier (sales only), Accountant (financial).",
        tips: [
          "Follow least-privilege原则",
          "Regularly review user access",
        ],
      },
      {
        id: "user-create",
        title: "Creating Users",
        content: "Go to Users & Roles, click Add User, fill in details and set a temporary password.",
        tips: [
          "Users must change password on first login",
          "Assign appropriate branch access",
        ],
      },
      {
        id: "user-reset",
        title: "Resetting Passwords",
        content: "Edit a user account and enter a new password in the reset field. User will be prompted to change on next login.",
        tips: [
          "Never tell anyone their password",
          "Force password change after reset",
        ],
      },
    ],
  },
  {
    id: "suppliers-training",
    title: "Supplier Management",
    description: "Manage your suppliers and orders",
    icon: Truck,
    duration: "10 min",
    lessons: [
      {
        id: "sup-add",
        title: "Adding Suppliers",
        content: "Navigate to Suppliers, click Add Supplier, enter name, contact details, KRA PIN, and address.",
        tips: [
          "Keep KRA PIN for tax compliance",
          "Track supplier balances",
        ],
      },
      {
        id: "sup-orders",
        title: "Purchase Orders",
        content: "Create purchase orders to track orders from suppliers. Mark as Received when stock arrives.",
        tips: [
          "Match received stock with orders",
          "Update inventory after receiving",
        ],
      },
    ],
  },
  {
    id: "reports-training",
    title: "Reports & Analytics",
    description: "Understanding your business data",
    icon: FileText,
    duration: "15 min",
    lessons: [
      {
        id: "rep-dashboard",
        title: "Dashboard Overview",
        content: "The dashboard shows today's sales, monthly revenue, inventory value, and key metrics at a glance.",
        tips: [
          "Check daily to monitor performance",
          "Compare with previous periods",
        ],
      },
      {
        id: "rep-sales",
        title: "Sales Reports",
        content: "View sales by date, payment method, product, or cashier. Export data for external analysis.",
        tips: [
          "Identify peak sales times",
          "Track top-selling products",
        ],
      },
      {
        id: "rep-financial",
        title: "Financial Reports",
        content: "Access profit & loss, expenses, and accounting entries. View balances and track financial health.",
        tips: [
          "Review monthly financials",
          "Categorize expenses properly",
        ],
      },
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Tips for efficient operations",
    icon: Award,
    duration: "10 min",
    lessons: [
      {
        id: "bp-daily",
        title: "Daily Operations",
        content: "Start each day by checking low stock alerts. Process sales efficiently. End day by reconciling with actual cash.",
        tips: [
          "Check inventory before opening",
          "Keep workspace organized",
        ],
      },
      {
        id: "bp-security",
        title: "Security Tips",
        content: "Never share passwords. Log out when leaving. Report suspicious activity. Keep backup of database.",
        tips: [
          "Change passwords regularly",
          "Use unique, strong passwords",
        ],
      },
      {
        id: "bp-backup",
        title: "Data Backup",
        content: "Regularly backup the database file. Store copies in different locations. Test restore process periodically.",
        tips: [
          "Backup weekly minimum",
          "Store backups off-site",
        ],
      },
    ],
  },
];

export default function TrainingPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const currentModule = trainingModules.find((m) => m.id === activeModule);
  const currentLesson = currentModule?.lessons.find((l) => l.id === activeLesson);

  const filteredModules = trainingModules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLessons = trainingModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const markComplete = () => {
    if (activeLesson) {
      setCompletedLessons((prev) => new Set([...prev, activeLesson]));
    }
  };

  const getNextLesson = () => {
    if (!currentModule || !activeLesson) return null;
    const currentIndex = currentModule.lessons.findIndex((l) => l.id === activeLesson);
    if (currentIndex < currentModule.lessons.length - 1) {
      return currentModule.lessons[currentIndex + 1];
    }
    // Find next module
    const moduleIndex = trainingModules.findIndex((m) => m.id === currentModule.id);
    if (moduleIndex < trainingModules.length - 1) {
      return trainingModules[moduleIndex + 1].lessons[0];
    }
    return null;
  };

  return (
    <div>
      <TopBar title="Training Center" subtitle="Learn how to use Lexintel POS System" />

      <div className="p-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f0f8" }}>
                <GraduationCap size={24} style={{ color: "#1a3a5c" }} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Your Learning Progress</h2>
                <p className="text-sm text-slate-500">{completedCount} of {totalLessons} lessons completed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: "#1a3a5c" }}>{progressPercent}%</p>
              <p className="text-xs text-slate-500">Complete</p>
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: "#1a3a5c" }}
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Module List */}
          <div className={`${activeLesson ? 'w-1/2' : 'w-full'}`}>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search training modules..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Modules Grid */}
            <div className="grid gap-4">
              {filteredModules.map((module) => {
                const Icon = module.icon;
                const moduleCompleted = module.lessons.every((l) => completedLessons.has(l.id));
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id);
                      setActiveLesson(module.lessons[0].id);
                    }}
                    className={`bg-white rounded-xl p-5 text-left border transition-all ${
                      isActive ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#e8f0f8" }}>
                        <Icon size={20} style={{ color: "#1a3a5c" }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800">{module.title}</h3>
                          {moduleCompleted && <CheckCircle size={16} className="text-emerald-500" />}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{module.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {module.duration}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <BookOpen size={12} />
                            {module.lessons.length} lessons
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Content */}
          {activeLesson && currentLesson && (
            <div className="w-1/2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
                {/* Module Header */}
                <div className="p-4 border-b border-slate-100" style={{ backgroundColor: "#f8fafc" }}>
                  <button
                    onClick={() => setActiveModule(null)}
                    className="text-sm text-slate-500 hover:text-slate-700 mb-2"
                  >
                    ← Back to modules
                  </button>
                  <h3 className="font-semibold text-slate-800">{currentModule?.title}</h3>
                  <p className="text-xs text-slate-500">{currentLesson.title}</p>
                </div>

                {/* Lesson Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Play size={16} className="text-sky-500" />
                      <span className="text-xs font-medium text-sky-600 uppercase tracking-wide">Lesson</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{currentLesson.content}</p>
                  </div>

                  {/* Tips */}
                  {currentLesson.tips && currentLesson.tips.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={16} className="text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">Tips</span>
                      </div>
                      <ul className="space-y-2">
                        {currentLesson.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                            <span className="text-amber-500">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {!completedLessons.has(activeLesson) && (
                      <button
                        onClick={markComplete}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Mark Complete
                      </button>
                    )}
                    {completedLessons.has(activeLesson) && (
                      <Badge variant="success">Completed ✓</Badge>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                {getNextLesson() && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => setActiveLesson(getNextLesson()!.id)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

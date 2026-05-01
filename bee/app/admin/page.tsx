"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { Lock, Unlock, Loader2, Plus, CheckCircle2, Image as ImageIcon, X, ChevronDown, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  ID: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  colors: string;
  sizes: string;
  stock: number;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [products, setProducts] = useState<Product[]>([]);

  const [existingCategories, setExistingCategories] = useState([
    "Bags", "Sets", "Dresses", "Outerwear", "Tops", "Bottoms", "Accessories"
  ]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Bags", 
    colors: "",
    sizes: "",
    stock: "", 
    isNew: false,
  });
  
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/products");
      const data = await res.json();
      setProducts(data || []);
      
      const uniqueCats = Array.from(new Set(data.map((p: Product) => p.category)));
      setExistingCategories(prev => {
        const combined = Array.from(new Set([...prev, ...(uniqueCats as string[])]));
        return combined;
      });
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedToken) setToken(savedToken);

    fetchProducts();
  }, [fetchProducts]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setToken(data.token);
      localStorage.setItem("admin_token", data.token);
    } catch (err) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError("An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("admin_token");
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this drop?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");
      
      fetchProducts();
    } catch (error) { 
      console.error(error);
      alert("Error deleting product");
    }
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    const finalCategory = isCustomCategoryMode ? customCategory : formData.category;

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("category", finalCategory);
    submitData.append("colors", formData.colors);
    submitData.append("sizes", formData.sizes);
    submitData.append("stock", formData.stock); 
    submitData.append("isNew", String(formData.isNew));
    
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const res = await fetch("http://localhost:8080/admin/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: submitData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to create product");
      }

      setSuccessMsg("Drop published successfully!");
      
      if (isCustomCategoryMode && !existingCategories.includes(customCategory)) {
        setExistingCategories(prev => [...prev, customCategory]);
      }

      setFormData({ name: "", price: "", category: isCustomCategoryMode ? customCategory : formData.category, colors: "", sizes: "", stock: "", isNew: false });
      setIsCustomCategoryMode(false);
      setCustomCategory("");
      setImageFile(null);
      fetchProducts();
      
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      if (err instanceof Error) alert(err.message);
      else alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-boutique-light dark:bg-boutique-dark flex items-center justify-center p-5 transition-colors duration-500">
        <div className="w-full max-w-md p-8 md:p-10 bg-white dark:bg-[#1A1715] shadow-2xl rounded-sm border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
            </div>
            <h1 className="text-2xl font-bold font-script text-neutral-900 dark:text-neutral-50 text-center tracking-wider mb-1">BEE Empire&apos;s</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full py-4 mt-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors flex justify-center items-center">
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Vault"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black transition-colors duration-500 pb-20">
      <nav className="w-full bg-white dark:bg-[#1A1715] border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Unlock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          <span className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50">Command Center</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" target="_blank" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-amber-600 transition-colors">View Live Store ↗</Link>
          <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Lock Vault</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Publish New Drop</h1>
            <p className="text-sm text-neutral-500 font-medium">Add a new piece to the active inventory.</p>
          </div>

          <form onSubmit={handleCreateProduct} className="bg-white dark:bg-[#1A1715] p-6 md:p-10 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-8 rounded-sm">
            
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm p-8 flex flex-col items-center justify-center relative hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              {imageFile ? (
                <div className="text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{imageFile.name}</p>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Click to change file</p>
                </div>
              ) : (
                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                  <ImageIcon className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">Upload Product Image</p>
                  <p className="text-xs text-neutral-500 mt-2">JPEG, PNG, WEBP</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dior Pattern Handbag" className="w-full p-3 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Price (₦)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="14500" className="w-full p-3 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Category</label>
                
                {isCustomCategoryMode ? (
                  <div className="relative animate-in fade-in zoom-in-95 duration-200">
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      placeholder="Type new category (e.g. Footwear)" 
                      className="w-full p-3 pr-12 bg-transparent border-b-2 border-amber-600 text-neutral-900 dark:text-neutral-50 text-sm outline-none transition-colors" 
                      autoFocus
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setIsCustomCategoryMode(false);
                        setCustomCategory("");
                      }}
                      className="absolute right-0 top-0 bottom-0 px-3 text-neutral-400 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <select 
                      value={formData.category} 
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomCategoryMode(true);
                        } else {
                          setFormData({...formData, category: e.target.value});
                        }
                      }} 
                      className="w-full p-3 pr-10 appearance-none bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors cursor-pointer"
                    >
                      {existingCategories.map((cat) => (
                        <option key={cat} value={cat} className="bg-white dark:bg-[#1A1715]">{cat}</option>
                      ))}
                      <option disabled>──────────</option>
                      <option value="custom" className="font-bold text-amber-600">+ Create New Category...</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  <Package className="w-3 h-3" /> Quantity
                </label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="e.g. 50" min="0" className="w-full p-3 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Available Colors</label>
                <input type="text" value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} placeholder="Black, White, Sky Blue" className="w-full p-3 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Available Sizes</label>
                <input type="text" value={formData.sizes} onChange={(e) => setFormData({...formData, sizes: e.target.value})} placeholder="S, M, L, XL (or 'Standard')" className="w-full p-3 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input type="checkbox" id="isNew" checked={formData.isNew} onChange={(e) => setFormData({...formData, isNew: e.target.checked})} className="w-5 h-5 accent-amber-600 cursor-pointer" />
              <label htmlFor="isNew" className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 cursor-pointer">
                Tag as &quot;New Drop&quot;
              </label>
            </div>

            <div className="pt-6 flex items-center justify-between">
              {successMsg ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-500 text-sm font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-5 h-5" />
                  {successMsg}
                </div>
              ) : <div />}

              <button type="submit" disabled={isSubmitting} className="px-8 py-4 bg-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {isSubmitting ? "Publishing..." : "Publish to Store"}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Active Inventory</h1>
            <p className="text-sm text-neutral-500 font-medium">Manage existing products, colors, and stock levels.</p>
          </div>

          <div className="bg-white dark:bg-[#1A1715] p-2 md:p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 rounded-sm max-h-212.5 overflow-y-auto">
            {products.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-medium">
                No products found in the database. Add your first drop!
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product: Product) => (
                  <div key={product.ID} className="flex items-start justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm hover:border-amber-600 transition-colors group bg-neutral-50 dark:bg-black/50">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 relative rounded-sm overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                        {product.imageUrl && (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-neutral-50 mb-1">{product.name}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest rounded-sm text-neutral-700 dark:text-neutral-300">
                            {product.category}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-sm ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium mb-1 line-clamp-1"><span className="font-bold">Colors:</span> {product.colors || "N/A"}</p>
                        <p className="text-sm font-bold text-amber-600">₦{product.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(product.ID)}
                      className="p-3 text-neutral-400 hover:text-white hover:bg-red-500 rounded-sm transition-all shrink-0"
                      title="Delete Drop"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
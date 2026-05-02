"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { Lock, Unlock, Loader2, X, ChevronDown, Trash2, Package, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  ID: number;
  name?: string; Name?: string;
  price?: number; Price?: number;
  category?: string; Category?: string;
  imageUrl?: string; ImageUrl?: string;
  colors?: string; Colors?: string;
  sizes?: string; Sizes?: string;
  stock?: number; Stock?: number;
  isNew?: boolean; IsNew?: boolean;
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
  const [existingCategories, setExistingCategories] = useState(["Bags", "Sets", "Dresses", "Outerwear", "Tops", "Bottoms", "Accessories"]);
  const [formData, setFormData] = useState({ name: "", price: "", category: "Bags", colors: "", sizes: "", stock: "", isNew: false });
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      // CACHE BUSTER ADDED
      const res = await fetch("http://localhost:8080/products?t=" + new Date().getTime(), { cache: "no-store" });
      const data = await res.json();
      setProducts(data || []);
      const uniqueCats = Array.from(new Set((data || []).map((p: Product) => p.category || p.Category)));
      setExistingCategories(prev => Array.from(new Set([...prev, ...(uniqueCats as string[])])));
    } catch (err) { 
      console.error("Inventory fetch failed:", err); 
    }
  }, []);

 useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    const timer = setTimeout(() => {
      if (savedToken) setToken(savedToken);
    }, 0);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();

    return () => clearTimeout(timer);
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
    } catch (err: unknown) {
      if (err instanceof Error) setLoginError(err.message);
      else setLoginError("An unexpected error occurred");
    } finally { setIsLoggingIn(false); }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("admin_token");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Permanently delete this drop?")) return;
    const activeToken = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${activeToken}` },
      });
      if (!res.ok) throw new Error();
      fetchProducts();
    } catch { alert("Failed to delete product."); }
  };

  const handleToggleNew = async (id: number) => {
    const activeToken = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}/toggle-new`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${activeToken}` },
      });
      if (!res.ok) throw new Error();
      fetchProducts(); 
    } catch { alert("Failed to update status."); }
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalCategory = isCustomCategoryMode ? customCategory : formData.category;
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("category", finalCategory);
    submitData.append("colors", formData.colors);
    submitData.append("sizes", formData.sizes);
    submitData.append("stock", formData.stock.toString());
    submitData.append("isNew", String(formData.isNew));
    if (imageFile) submitData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:8080/admin/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: submitData,
      });
      if (!res.ok) throw new Error();
      setSuccessMsg("Drop Published!");
      setFormData({ name: "", price: "", category: finalCategory, colors: "", sizes: "", stock: "", isNew: false });
      setIsCustomCategoryMode(false);
      setCustomCategory("");
      setImageFile(null);
      fetchProducts();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch { alert("Publishing failed."); } finally { setIsSubmitting(false); }
  };

  if (!token) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-5">
      <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-sm border">
        <div className="flex flex-col items-center mb-8 text-center">
          <Lock className="mb-4 text-neutral-900 w-8 h-8" />
          <h1 className="text-2xl font-bold uppercase tracking-widest">BEE EMPIRE</h1>
          <p className="text-xs font-bold text-neutral-500 tracking-tighter">ADMIN ACCESS</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 border outline-none focus:border-amber-600" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 border outline-none focus:border-amber-600" required />
          {loginError && <p className="text-red-500 text-xs font-bold text-center uppercase">{loginError}</p>}
          <button type="submit" disabled={isLoggingIn} className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors flex items-center justify-center">
            {isLoggingIn ? <Loader2 className="animate-spin w-5 h-5" /> : "Access Vault"}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black transition-colors duration-500 pb-20">
      <nav className="bg-white dark:bg-[#1A1715] border-b px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50">
          <Unlock className="text-amber-600 w-5 h-5" /> Command Center
        </div>
        <div className="flex gap-6 text-xs font-bold uppercase">
          <Link href="/" target="_blank" className="hover:text-amber-600 transition-colors">Storefront ↗</Link>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-colors">Lock</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-50">Publish New Drop</h1>
          <p className="text-sm text-neutral-500 font-medium mb-8">Add a new piece to the active inventory.</p>
          
          <form onSubmit={handleCreateProduct} className="bg-white dark:bg-[#1A1715] p-10 shadow-lg border dark:border-neutral-800 space-y-8">
            <div className="border-2 border-dashed p-8 text-center relative cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" required />
              {imageFile ? <div className="text-green-600 font-bold text-sm uppercase">{imageFile.name}</div> : <div className="text-neutral-400 font-bold uppercase text-xs">Upload Product Image</div>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="md:col-span-2 p-3 border-b-2 bg-transparent outline-none focus:border-amber-600 text-neutral-900 dark:text-neutral-50" required />
              <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="p-3 border-b-2 bg-transparent outline-none focus:border-amber-600 text-neutral-900 dark:text-neutral-50" required />
              
              <div className="md:col-span-2">
                {isCustomCategoryMode ? (
                  <div className="relative">
                    <input type="text" placeholder="New Category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full p-3 border-b-2 border-amber-600 bg-transparent outline-none text-neutral-900 dark:text-neutral-50" autoFocus required />
                    <X onClick={() => setIsCustomCategoryMode(false)} className="absolute right-0 top-3 cursor-pointer text-neutral-400 w-5 h-5" />
                  </div>
                ) : (
                  <div className="relative">
                    <select value={formData.category} onChange={(e) => e.target.value === "custom" ? setIsCustomCategoryMode(true) : setFormData({...formData, category: e.target.value})} className="w-full p-3 border-b-2 bg-transparent outline-none cursor-pointer appearance-none text-neutral-900 dark:text-neutral-50">
                      {existingCategories.map(cat => <option key={cat} value={cat} className="bg-white dark:bg-black">{cat}</option>)}
                      <option value="custom" className="font-bold text-amber-600">+ New Category</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-4 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                )}
              </div>
              <input type="number" placeholder="Stock Quantity" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="p-3 border-b-2 bg-transparent outline-none focus:border-amber-600 text-neutral-900 dark:text-neutral-50" required />
            </div>

            <div className="grid grid-cols-2 gap-8 border-t dark:border-neutral-800 pt-4">
              <input type="text" placeholder="Colors (e.g. Red, Black)" value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} className="p-3 border bg-transparent outline-none focus:border-amber-600 text-neutral-900 dark:text-neutral-50" required />
              <input type="text" placeholder="Sizes (e.g. S, M, L)" value={formData.sizes} onChange={(e) => setFormData({...formData, sizes: e.target.value})} className="p-3 border bg-transparent outline-none focus:border-amber-600 text-neutral-900 dark:text-neutral-50" required />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input type="checkbox" id="isNew" checked={formData.isNew} onChange={(e) => setFormData({...formData, isNew: e.target.checked})} className="w-5 h-5 accent-amber-600 cursor-pointer" />
              <label htmlFor="isNew" className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 cursor-pointer">
                Tag as &quot;New Drop&quot;
              </label>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white py-4 font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center">
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Publish to Store"}
            </button>
            {successMsg && <p className="text-green-600 font-bold text-center animate-pulse">{successMsg}</p>}
          </form>
        </div>

        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Live Inventory</h1>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-6">Manage active items and stock</p>
          </div>

          <div className="bg-white dark:bg-[#1A1715] p-2 md:p-6 shadow-xl border dark:border-neutral-800 rounded-sm max-h-212.5 overflow-y-auto">
            {products.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-medium">
                No products found in the database. Add your first drop!
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => {
                  const pName = product.name || product.Name || "";
                  const pPrice = product.price || product.Price || 0;
                  const pCategory = product.category || product.Category || "";
                  const pImageUrl = product.imageUrl || product.ImageUrl || "";
                  const pColors = product.colors || product.Colors || "";
                  const pStock = Number(product.stock ?? product.Stock ?? 0);
                  const pIsNew = product.isNew ?? product.IsNew ?? false;

                  return (
                    <div key={product.ID} className="flex flex-col sm:flex-row sm:items-start justify-between p-4 border dark:border-neutral-800 bg-neutral-50 dark:bg-black/50 hover:border-amber-600 transition-colors group gap-4">
                      <div className="flex items-start gap-4 w-full">
                        <div className="w-20 h-20 relative bg-neutral-200 dark:bg-neutral-800 shrink-0 overflow-hidden rounded-sm flex items-center justify-center">
                          {pImageUrl ? (
                            <Image src={pImageUrl} alt={pName} fill sizes="80px" className="object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">No Img</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-neutral-900 dark:text-neutral-50 truncate" title={pName}>{pName}</p>
                          
                          <div className="flex flex-wrap gap-2 items-center my-1">
                            <span className="text-[10px] font-bold uppercase text-amber-600 shrink-0">{pCategory}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm flex items-center gap-1 shrink-0 ${pStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              <Package className="w-3 h-3" /> {pStock > 0 ? `${pStock} In Stock` : "Sold Out"}
                            </span>
                          </div>
                          
                          <p className="text-xs text-neutral-500 font-medium mb-1 truncate" title={pColors}>Colors: {pColors}</p>
                          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">₦{pPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                        <button 
                          onClick={() => handleToggleNew(product.ID)} 
                          className={`flex-1 sm:flex-none p-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 ${pIsNew ? 'bg-amber-600 text-white' : 'bg-neutral-200 text-neutral-500 hover:bg-amber-100'}`}
                          title="Toggle New Drop Status"
                        >
                          <Star className={`w-3 h-3 ${pIsNew ? 'fill-current' : ''}`} /> {pIsNew ? 'New' : 'Tag'}
                        </button>
                        <button 
                          onClick={() => handleDelete(product.ID)} 
                          className="flex-1 sm:flex-none p-2 bg-neutral-200 text-neutral-400 hover:text-white hover:bg-red-500 rounded-sm transition-all flex justify-center"
                          title="Delete Drop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
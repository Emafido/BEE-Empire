"use client";

import { useState, useEffect, FormEvent } from "react";
import { Lock, Unlock, Loader2, Plus, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Bags",
    colors: "",
    sizes: "",
    isNew: false,
  });
  
  // NEW: State for the physical file
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedToken) setToken(savedToken);
  }, []);

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

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    // NEW: We use FormData to package the file and the text together
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("colors", formData.colors);
    submitData.append("sizes", formData.sizes);
    submitData.append("isNew", String(formData.isNew));
    
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const res = await fetch("http://localhost:8080/admin/products", {
        method: "POST",
        // Notice we DO NOT set Content-Type here. The browser sets it automatically to multipart/form-data
        headers: {
          "Authorization": `Bearer ${token}`
        },
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
      setFormData({ name: "", price: "", category: "Bags", colors: "", sizes: "", isNew: false });
      setImageFile(null);
      
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
      <div className="min-h-screen bg-boutique-light dark:bg-boutique-dark flex items-center justify-center p-5 selection:bg-amber-600 selection:text-white transition-colors duration-500">
        {/* ... (Login UI unchanged) ... */}
        <div className="w-full max-w-md p-8 md:p-10 bg-white dark:bg-[#1A1715] shadow-2xl rounded-sm border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-500">
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
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 dark:focus:border-amber-500 outline-none transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 dark:focus:border-amber-500 outline-none transition-colors" required />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full py-4 mt-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-widest text-sm hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors flex justify-center items-center">
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Vault"}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-amber-600 transition-colors">
              &larr; Return to Storefront
            </Link>
          </div>
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
          {/* FIXED: Added target="_blank" so she doesn't lose her session view */}
          <Link href="/" target="_blank" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-amber-600 transition-colors">View Live Store ↗</Link>
          <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">
            Lock Vault
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 mt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Publish New Drop</h1>
          <p className="text-sm text-neutral-500 font-medium">Add a new piece to the active inventory.</p>
        </div>

        <form onSubmit={handleCreateProduct} className="bg-white dark:bg-[#1A1715] p-6 md:p-10 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-8 rounded-sm">
          
          {/* File Upload Area */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Product Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dior Pattern Handbag" className="w-full p-3 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Price (₦)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="14500" className="w-full p-3 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-transparent border-b-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors cursor-pointer">
                <option value="Bags">Bags</option>
                <option value="Sets">Two-Pieces & Sets</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Available Colors</label>
              <input type="text" value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} placeholder="Black, White, Sky Blue" className="w-full p-3 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-wide">Separate with commas</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Available Sizes</label>
              <input type="text" value={formData.sizes} onChange={(e) => setFormData({...formData, sizes: e.target.value})} placeholder="S, M, L, XL (or 'Standard' for bags)" className="w-full p-3 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 text-sm focus:border-amber-600 outline-none transition-colors" required />
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-wide">Separate with commas</p>
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
      </main>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  X, 
  Camera, 
  UploadCloud, 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  CheckCircle2, 
  Eye,
  Upload
} from 'lucide-react';
import { simulateVisualSearch, VisualMatchResult } from '../../services/aiEngine';
import { catalogService } from '../../services/catalogService';

export const SnapAndShopModal: React.FC = () => {
  const { 
    isSnapShopModalOpen, 
    setIsSnapShopModalOpen, 
    setSelectedProduct, 
    addToCart,
    showToast
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<string>('handbag');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VisualMatchResult[]>(simulateVisualSearch('purse'));
  // Hooks must run on every render, so this lives above the early return below.
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSnapShopModalOpen) return null;

  const presets = [
    {
      id: 'handbag',
      label: '👜 Black Leather Bag',
      query: 'purse',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'sneakers',
      label: '👟 Nike Air Sneakers',
      query: 'sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'laptop',
      label: '💻 OLED Laptop',
      query: 'laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'lamp',
      label: '💡 Vintage Desk Lamp',
      query: 'lamp',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleSelectPreset = async (preset: typeof presets[0]) => {
    setSelectedPreset(preset.id);
    setIsAnalyzing(true);
    try {
      const matches = await catalogService.searchByVisualPreset(preset.query);
      setResults(matches);
    } catch {
      // Server unreachable: use the on-device demo matcher.
      setResults(simulateVisualSearch(preset.query));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setSelectedPreset('custom-upload');
    setIsAnalyzing(true);
    try {
      const matches = await catalogService.uploadVisualSearch(file);
      setResults(matches);
    } catch (err) {
      showToast('Image search issue', err instanceof Error ? err.message : 'Could not analyse that image.', 'warning');
      setResults(simulateVisualSearch(file.name));
    } finally {
      setIsAnalyzing(false);
      input.value = ''; // allow re-uploading the same file
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-soft-lg border border-pink-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-pink-100 text-chocolate-900 text-xs font-extrabold px-3 py-1 rounded-full border border-pink-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-pink-600" />
              Computer Vision Search
            </span>
            <span className="text-xs text-chocolate-500 font-medium hidden sm:inline">
              Feature 17 • Snap & Shop
            </span>
          </div>

          <button
            onClick={() => setIsSnapShopModalOpen(false)}
            className="p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Upload / Pick Target Image Box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-cream-100/70 p-6 rounded-3xl border-2 border-dashed border-pink-300 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50/50 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <UploadCloud className="w-10 h-10 text-pink-500 group-hover:scale-110 transition-transform mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              Upload a Photo or Choose a Sample Preset
            </h3>
            <p className="text-xs text-chocolate-600 mt-1 max-w-md mx-auto">
              InfinityHub analyzes visual features like silhouette, texture, colorway, and hardware across 16 monitored retailers. Click to upload any image (JPG, PNG, WebP).
            </p>

            {/* Presets Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2 rounded-2xl border-2 transition-all cursor-pointer bg-white text-left ${
                    selectedPreset === p.id ? 'border-pink-500 shadow-md scale-105' : 'border-pink-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={p.image} alt={p.label} className="w-full h-20 object-cover rounded-xl mb-1.5" />
                  <span className="text-[11px] font-bold text-chocolate-950 block truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Matching Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif text-base font-bold text-chocolate-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Visual Matching Results Across Stores
              </h4>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {results.length} Visual Matches Detected
              </span>
            </div>

            {isAnalyzing ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-chocolate-800">
                  Infinity AI is extracting visual embeddings across multi-store catalogs...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((res, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white border border-pink-200 shadow-soft hover:shadow-soft-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img src={res.product.image} alt={res.product.name} className="w-16 h-16 object-contain rounded-xl bg-cream-50 p-1 border border-pink-100 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                            {res.similarityScore}% Visual Match
                          </span>
                          <span className="text-[10px] font-extrabold text-chocolate-800 uppercase">
                            {res.product.store}
                          </span>
                        </div>
                        <h5 className="font-serif text-xs sm:text-sm font-bold text-chocolate-950 truncate max-w-sm mt-0.5">
                          {res.product.name}
                        </h5>
                        <p className="text-[11px] text-chocolate-600">
                          Matched: <strong className="text-chocolate-800">{res.matchedVisualFeature}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-100">
                      <span className="font-serif text-base font-bold text-chocolate-950">
                        ₹{res.product.finalEstimatedPrice.toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedProduct(res.product);
                            setIsSnapShopModalOpen(false);
                          }}
                          className="p-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-chocolate-900 text-xs font-bold cursor-pointer"
                          title="Inspect"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addToCart(res.product)}
                          className="px-3 py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

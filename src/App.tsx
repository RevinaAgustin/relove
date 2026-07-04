/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ExploreView } from './components/beranda/ExploreView';
import { ProductDetailView } from './components/katalog/ProductDetailView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { PaymentView } from './components/checkout/PaymentView';
import { TrackOrderView } from './components/checkout/TrackOrderView';
import { ReviewSellerView } from './components/checkout/ReviewSellerView';
import { ProfileView } from './components/profile/ProfileView';
import { SellerDashboardView } from './components/seller-dashboard/SellerDashboardView';
import { CreateListingView } from './components/tambah-listing/CreateListingView';
import { CatalogView } from './components/katalog/CatalogView';
import { LoginView } from './components/auth/LoginView';
import { MessagesView } from './components/messages/MessagesView';
import { SellerShopView } from './components/katalog/SellerShopView';
import { SellerFinanceView } from './components/seller-dashboard/SellerFinanceView';
import { WithdrawFundsView } from './components/seller-dashboard/WithdrawFundsView';
import { ManageProductsView } from './components/seller-dashboard/ManageProductsView';
import { SellerOrdersView } from './components/seller-dashboard/SellerOrdersView';
import { EditProfileView } from './components/profile/EditProfileView';
import { SidebarDrawer } from './components/common/SidebarDrawer';
import { ToastNotification, ToastItem } from './components/common/ToastNotification';

import { INITIAL_PRODUCTS } from './data';
import { Product, Order, Screen, CartItem } from './types';

export default function App() {
  // One-time reset to clear previous dummy data for testing
  if (typeof window !== 'undefined' && !localStorage.getItem('re_love_db_cleared_v4')) {
    localStorage.removeItem('relove_products');
    localStorage.removeItem('re_love_users');
    localStorage.removeItem('re_love_active_user');
    localStorage.removeItem('re_love_user_profile');
    localStorage.removeItem('re_love_orders');
    localStorage.removeItem('re_love_chats');
    localStorage.removeItem('re_love_wishlist');
    localStorage.removeItem('re_love_cart');
    localStorage.removeItem('re_love_addresses');
    localStorage.removeItem('re_love_seller_balance');
    localStorage.removeItem('re_love_reviews');
    localStorage.setItem('re_love_db_cleared_v4', 'true');
  }

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('relove_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('relove_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage (quota exceeded):', e);
    }
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const saved = localStorage.getItem('relove_products');
    const initialList = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return initialList.length > 0 ? initialList[0] : null;
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('explore');
  const [selectedSellerName, setSelectedSellerName] = useState<string>('');
  const [shopBackScreen, setShopBackScreen] = useState<Screen>('explore');
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer');
  const [sellerBalance, setSellerBalance] = useState<number>(12450000);
  
  // Lists holding cart & wishlist states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<{ product: Product; quantity: number }[]>([]);

  // Sliding drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerType, setDrawerType] = useState<'wishlist' | 'cart'>('wishlist');

  // Custom Toast Notifications State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: 'cart' | 'wishlist' | 'remove_wishlist', product: Product, quantity?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, product, quantity }]);
  };

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastAction = (type: 'cart' | 'wishlist') => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateCartQty = (index: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleToggleCartSelection = (index: number) => {
    setCart((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleToggleShopSelection = (sellerName: string, selected: boolean) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.sellerName === sellerName ? { ...item, selected } : item
      )
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToast('remove_wishlist', product);
    }
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const handleCheckoutFromDrawer = () => {
    const selectedItems = cart.filter((item) => item.selected);
    if (selectedItems.length === 0) return;
    setCheckoutItems(selectedItems.map((item) => ({ product: item.product, quantity: item.quantity })));
    setSelectedProduct(null);
    navigate('checkout');
  };
  
  const handleSetIsLoggedIn = (val: boolean) => {
    setIsLoggedIn(val);
    if (!val) {
      setCart([]);
      setWishlist([]);
      localStorage.removeItem('re_love_active_user');
    } else {
      setWishlist([]);
    }
  };

  const handleLoginSuccess = (profile?: { name: string; shopName: string; email: string; phone: string; avatar: string }) => {
    setIsLoggedIn(true);
    if (profile) {
      setUserProfile(profile);
      localStorage.setItem('re_love_user_profile', JSON.stringify(profile));
      localStorage.setItem('re_love_active_user', JSON.stringify(profile));
    }
  };
  
  // Default active list of orders for the simulator
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('re_love_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('re_love_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  // Current order undergoing active transactional processing
  const [activePayingOrder, setActivePayingOrder] = useState<Order | null>(null);
  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(null);
  const [detailBackScreen, setDetailBackScreen] = useState<Screen>('explore');
  
  // Default active tab inside Profile screen
  const [profileTab, setProfileTab] = useState<'wishlist' | 'orders' | 'seller'>('orders');

  const [userProfile, setUserProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedActiveUser = localStorage.getItem('re_love_active_user');
      if (savedActiveUser) {
        try {
          return JSON.parse(savedActiveUser);
        } catch (e) {}
      }

      const saved = localStorage.getItem('re_love_user_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      name: 'Sarah J.',
      shopName: 'UrbanArchive Vintage',
      email: 'sarah.j@relove.com',
      phone: '+62 812-9876-5432',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOp2IWcbJj0WSBYUi9ScAhNe_jVNFSJrwvrH_iuZjBFJcvwzitf49Ul4GBxTD-Sa3acz2JRcH91HhhA9bjMBx5c_Xi_BgwFmf1j0AU56trzUu_iSxVtifVayiCz5_ELhoo_0az3lfkhPmfJmPsLhUTnV0qFrItiZ7yxaJlDTWG2AWZBhskCnqWEkcIWjPoCVLfSYj8fl9WVgywiwKIbx2n6WMsnQXFCBLOE8lXOnpfstrxZsgJIhXR-SuzI-scHKvwnG2GUOswM6LH',
    };
  });

  const handleUpdateProfile = (updated: typeof userProfile) => {
    const oldShopName = userProfile.shopName;
    setUserProfile(updated);
    localStorage.setItem('re_love_user_profile', JSON.stringify(updated));
    
    // Auto-update products and orders sellerName to match new shopName
    setProducts((prev) =>
      prev.map((p) =>
        p.sellerName === oldShopName
          ? { ...p, sellerName: updated.shopName }
          : p
      )
    );
    setOrders((prev) =>
      prev.map((o) =>
        o.sellerName === oldShopName
          ? { ...o, sellerName: updated.shopName }
          : o
      )
    );
  };

  // Search & Navigation-based filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [lastProductListScreen, setLastProductListScreen] = useState<'explore' | 'catalog'>('explore');

  // Navigator helper
  const navigate = (screen: Screen) => {
    if (screen === 'explore' || screen === 'catalog') {
      setLastProductListScreen(screen);
    }
    if (screen === 'seller-shop') {
      setShopBackScreen(currentScreen);
      if (profileTab === 'seller' || currentScreen === 'seller-dashboard') {
        setSelectedSellerName(userProfile.shopName);
      }
    }
    if (screen === 'seller-dashboard') {
      setProfileTab('seller');
      setCurrentScreen('profile');
    } else if (screen === 'profile') {
      setProfileTab('orders');
      setCurrentScreen('profile');
    } else {
      setCurrentScreen(screen);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailBackScreen(currentScreen);
    navigate('product-detail');
  };

  const toggleWishlist = (productId: string) => {
    if (!isLoggedIn) {
      alert('Silakan masuk ke akun Anda terlebih dahulu untuk menyukai produk.');
      navigate('login');
      return;
    }
    const product = products.find((p) => p.id === productId);
    const isAlready = wishlist.includes(productId);
    if (isAlready) {
      if (product) addToast('remove_wishlist', product);
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      if (product) addToast('wishlist', product);
      setWishlist((prev) => [...prev, productId]);
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!isLoggedIn) {
      alert('Silakan masuk ke akun Anda terlebih dahulu untuk menambahkan produk ke keranjang.');
      navigate('login');
      return;
    }
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { product, quantity, selected: true }];
      }
    });
    addToast('cart', product, quantity);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    if (!isLoggedIn) {
      alert('Silakan masuk ke akun Anda terlebih dahulu untuk membeli produk.');
      navigate('login');
      return;
    }
    setSelectedProduct(null);
    setCheckoutItems([{ product, quantity }]);
    navigate('checkout');
  };

  const handleProceedToPayment = (courierName: string, courierFee: number, total: number) => {
    const isSingle = !!selectedProduct;
    const productId = isSingle ? selectedProduct!.id : 'multi-checkout';
    const productName = isSingle
      ? selectedProduct!.name
      : checkoutItems.map((item) => `${item.product.name} (x${item.quantity})`).join(', ');
    const image = isSingle ? selectedProduct!.imagePrimary : checkoutItems[0]?.product.imagePrimary || '';
    const sellerName = isSingle ? selectedProduct!.sellerName : 'Multi Seller';

    // Instantiate new live order
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      productId: productId,
      productName: productName,
      image: image,
      sellerName: sellerName,
      totalAmount: total,
      courier: courierName,
      courierFee: courierFee,
      serviceFee: 2500,
      status: 'Waiting',
      resi: `RE-${Math.floor(1000 + Math.random() * 9000)}-JKT-62`,
      date: 'Hari ini',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActivePayingOrder(newOrder);
    navigate('payment');
  };

  const handleVerifyPayment = () => {
    // Transition the paying order to Paid status
    const targetOrder = activePayingOrder || orders[0];
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === targetOrder.id ? { ...ord, status: 'Paid' } : ord
      )
    );

    // Filter out checked out items from cart
    if (checkoutItems.length > 0) {
      const checkoutIds = checkoutItems.map((item) => item.product.id);
      setCart((prev) => prev.filter((item) => !checkoutIds.includes(item.product.id)));
      setCheckoutItems([]);
    }

    navigate('track-order');
  };

  const handleConfirmReceived = () => {
    const targetOrder = activePayingOrder || orders[0];
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === targetOrder.id ? { ...ord, status: 'Received' } : ord
      )
    );
    if (activePayingOrder && activePayingOrder.id === targetOrder.id) {
      setActivePayingOrder({ ...activePayingOrder, status: 'Received' });
    }
    navigate('review-seller');
  };

  const handlePublishListing = (newProductData: Partial<Product>) => {
    if (newProductData.id) {
      handleUpdateProduct(newProductData as Product);
      setProductBeingEdited(null);
      return;
    }

    const generatedProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProductData.name || 'Produk Baru',
      brand: newProductData.brand || 'Vintage Brand',
      category: newProductData.category || 'Atasan',
      size: newProductData.size || 'M',
      condition: (newProductData.condition as any) || 'Sangat Baik',
      price: newProductData.price || 150000,
      description: newProductData.description || 'Barang preloved terkurasi.',
      imagePrimary: newProductData.imagePrimary || 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      imageHover: newProductData.imageHover || 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      isVerified: true,
      sellerName: newProductData.sellerName || 'UrbanArchive Vintage',
      sellerRating: newProductData.sellerRating || 4.9,
    };

    setProducts((prev) => [generatedProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    if (selectedProduct && selectedProduct.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], resi?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status, ...(resi ? { resi } : {}) }
          : ord
      )
    );
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const handleSubmitReview = (stars: number, text: string) => {
    alert(`Ulasan (${stars}/5 Bintang) dikirim: "${text}"`);
    // Complete transit updates
    const targetOrder = activePayingOrder || orders[0];
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === targetOrder.id ? { ...ord, status: 'Reviewed' } : ord
      )
    );
    if (activePayingOrder && activePayingOrder.id === targetOrder.id) {
      setActivePayingOrder({ ...activePayingOrder, status: 'Reviewed' });
    }
    navigate('profile');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id) && !p.isArchived);

  // Visual layout shell styling
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col justify-between selection:bg-[#c0edd3]/60 selection:text-[#002d1c] antialiased">
      
      {/* Dynamic Navigation Header */}
      <Header
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        currentScreen={currentScreen}
        navigate={navigate}
        setUserMode={setUserMode}
        userMode={userMode}
        wishlistCount={wishlist.length}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={handleSetIsLoggedIn}
        onOpenWishlistDrawer={() => {
          setDrawerType('wishlist');
          setIsDrawerOpen(true);
        }}
        onOpenCartDrawer={() => {
          setDrawerType('cart');
          setIsDrawerOpen(true);
        }}
      />

      {/* Main Body Centered Content Inclosure */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-16 pt-28 pb-12">
        {currentScreen === 'explore' && (
          <ExploreView
            navigate={navigate}
            products={products.filter((p) => !p.isArchived)}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={handleSetIsLoggedIn}
          />
        )}

        {currentScreen === 'catalog' && (
          <CatalogView
            navigate={navigate}
            products={products.filter((p) => !p.isArchived)}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {currentScreen === 'product-detail' && (
          <ProductDetailView
            isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
            product={selectedProduct || products[0]}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onGoBack={() => {
              if (detailBackScreen === 'profile' && profileTab === 'seller') {
                navigate('seller-dashboard');
              } else {
                navigate(detailBackScreen);
              }
            }}
            onToggleWishlist={toggleWishlist}
            onGoToShop={(sellerName) => {
              setSelectedSellerName(sellerName);
              navigate('seller-shop');
            }}
            userProfile={userProfile}
            onEditProduct={(prod) => {
              setProductBeingEdited(prod);
              navigate('create-listing-info');
            }}
            onDeleteProduct={(productId) => {
              handleDeleteProduct(productId);
              if (detailBackScreen === 'profile' && profileTab === 'seller') {
                navigate('seller-dashboard');
              } else {
                navigate(detailBackScreen);
              }
            }}
            onUpdateProduct={(prod) => {
              handleUpdateProduct(prod);
              setSelectedProduct(prod);
            }}
          />
        )}

        {currentScreen === 'seller-shop' && (
          <SellerShopView
            sellerName={selectedSellerName}
            products={products.filter((p) => !p.isArchived)}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onSelectProduct={handleSelectProduct}
            onGoBack={() => navigate(shopBackScreen)}
            onChatSeller={(seller) => {
              navigate('messages');
            }}
            backLabel={
              shopBackScreen === 'seller-dashboard'
                ? 'Kembali ke Dashboard'
                : shopBackScreen === 'profile'
                ? 'Kembali ke Profil Saya'
                : shopBackScreen === 'product-detail'
                ? 'Kembali ke Detail Produk'
                : 'Kembali'
            }
            userProfile={userProfile}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutView
            product={selectedProduct}
            checkoutItems={checkoutItems}
            onGoBack={() => {
              if (selectedProduct) {
                navigate('product-detail');
              } else {
                navigate('explore');
              }
            }}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {currentScreen === 'payment' && (
          <PaymentView
            totalAmount={(activePayingOrder || orders[0]).totalAmount}
            onGoBack={() => navigate('profile')}
            onVerifyPayment={handleVerifyPayment}
          />
        )}

        {currentScreen === 'track-order' && (
          <TrackOrderView
            order={orders.find(o => o.id === activePayingOrder?.id) || activePayingOrder || orders[0]}
            onConfirmReceived={handleConfirmReceived}
            navigate={navigate}
          />
        )}

        {currentScreen === 'review-seller' && (
          <ReviewSellerView
            productName={(orders.find(o => o.id === activePayingOrder?.id) || activePayingOrder || orders[0]).productName}
            sellerName={(orders.find(o => o.id === activePayingOrder?.id) || activePayingOrder || orders[0]).sellerName}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileView
            key={profileTab}
            initialTab={profileTab}
            navigate={navigate}
            orders={orders}
            toggleWishlist={toggleWishlist}
            wishlistProducts={wishlistProducts}
            onSelectProduct={handleSelectProduct}
            products={products}
            setIsLoggedIn={handleSetIsLoggedIn}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onViewOwnShop={() => {
              setSelectedSellerName(userProfile.shopName);
              navigate('seller-shop');
            }}
          />
        )}

        {currentScreen === 'edit-profile' && (
          <EditProfileView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onGoBack={() => navigate('profile')}
          />
        )}

        {currentScreen === 'seller-dashboard' && (
          <SellerDashboardView
            products={products}
            onAddNewListing={() => {
              setProductBeingEdited(null);
              navigate('create-listing-info');
            }}
            onSelectProduct={handleSelectProduct}
            onSwitchToBuyer={() => {
              setUserMode('buyer');
              navigate('explore');
            }}
            onNavigateToFinance={() => navigate('seller-finance')}
            onNavigateToProducts={() => navigate('seller-products')}
            onNavigateToOrders={() => navigate('seller-orders')}
            onViewOwnShop={() => {
              setSelectedSellerName(userProfile.shopName);
              navigate('seller-shop');
            }}
            userProfile={userProfile}
          />
        )}

        {currentScreen === 'seller-finance' && (
          <SellerFinanceView
            balance={sellerBalance}
            onNavigate={navigate}
            onGoBack={() => navigate('seller-dashboard')}
          />
        )}

        {currentScreen === 'withdraw-funds' && (
          <WithdrawFundsView
            balance={sellerBalance}
            onWithdrawSuccess={() => {
              setSellerBalance(0);
              navigate('seller-finance');
            }}
            onGoBack={() => navigate('seller-finance')}
          />
        )}

        {currentScreen === 'seller-products' && (
          <ManageProductsView
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onGoBack={() => navigate('seller-dashboard')}
            onAddNewListing={() => {
              setProductBeingEdited(null);
              navigate('create-listing-info');
            }}
            onEditProduct={(prod) => {
              setProductBeingEdited(prod);
              navigate('create-listing-info');
            }}
            onPreviewProduct={handleSelectProduct}
            userProfile={userProfile}
          />
        )}

        {currentScreen === 'seller-orders' && (
          <SellerOrdersView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRejectOrder={handleRejectOrder}
            onGoBack={() => navigate('seller-dashboard')}
            userProfile={userProfile}
          />
        )}

        {currentScreen.startsWith('create-listing-') && (
          <CreateListingView
            currentScreen={currentScreen}
            navigate={navigate}
            onPublishListing={handlePublishListing}
            initialProduct={productBeingEdited}
          />
        )}

        {currentScreen === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            navigate={navigate}
          />
        )}

        {currentScreen === 'messages' && (
          <MessagesView
            navigate={navigate}
          />
        )}
      </main>

      {/* Sliding Drawer for Wishlist and Cart */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        type={drawerType}
        cartItems={cart}
        wishlistItems={wishlistProducts}
        onRemoveFromCart={handleRemoveFromCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onCheckout={handleCheckoutFromDrawer}
        onUpdateCartQty={handleUpdateCartQty}
        onToggleCartSelection={handleToggleCartSelection}
        onToggleShopSelection={handleToggleShopSelection}
        navigate={navigate}
      />

      {/* Elegant Custom Toast Notifications Popup */}
      <ToastNotification
        toasts={toasts}
        onClose={handleCloseToast}
        onActionClick={handleToastAction}
      />

      {/* Modern footer with ESG statements */}
      <Footer navigate={navigate} />
    </div>
  );
}

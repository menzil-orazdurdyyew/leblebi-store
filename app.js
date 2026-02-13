const { useState, useEffect } = React;

function App() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('sepet')) || []);
  const [lang, setLang] = useState(() => localStorage.getItem('dil') || 'tr');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [userReviews, setUserReviews] = useState(() => JSON.parse(localStorage.getItem('user_yorumlar')) || {});
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('Hepsi');

  const t = translations[lang] || translations['tr'];
  const langConfig = translations.langConfig;

  useEffect(() => {
    localStorage.setItem('sepet', JSON.stringify(cart));
    localStorage.setItem('dil', lang);
    localStorage.setItem('theme', theme);
    localStorage.setItem('user_yorumlar', JSON.stringify(userReviews));
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [cart, lang, theme, userReviews]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleCheckout = () => {
    setCart([]);
    setIsCartOpen(false);
    setShowOrderSuccess(true);
  };

  const addComment = (pid) => {
    if(!newReview.trim()) return;
    const current = userReviews[pid] || [];
    setUserReviews({...userReviews, [pid]: [{ text: newReview, lang: lang, stars: newRating }, ...current]});
    setNewReview("");
    setNewRating(5);
  };

  const filtered = products.filter(p => 
    (filter === 'Hepsi' || p.category === filter) && 
    (p.names[lang] || p.names['tr']).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '90px' }}>
      
      {/* HEADER */}
      <div className="header">
        <button onClick={() => setIsMenuOpen(true)} className="menu-btn">☰</button>
        <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>LEBLEBİ STORE</h2>
        <div style={{ width: '30px' }}></div>
      </div>

      {/* YAN MENÜ */}
      {isMenuOpen && (
        <div className="side-menu-container" onClick={() => setIsMenuOpen(false)}>
          <div className="side-menu" onClick={e => e.stopPropagation()}>
            <div className="menu-header">
               <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Menu</h3>
               <button onClick={() => setIsMenuOpen(false)} style={{ border: 'none', background: 'none', fontSize: '28px', color: 'var(--text-color)' }}>&times;</button>
            </div>
            
            <div className="menu-body">
              <div className="menu-item" onClick={() => { setShowAbout(true); setIsMenuOpen(false); }}>
                <span>🏢</span> {t.about}
              </div>
              <div className="menu-item" onClick={() => { setShowContact(true); setIsMenuOpen(false); }}>
                <span>📞</span> {t.contact}
              </div>
              <hr style={{ margin: '15px 0', borderColor: 'var(--border-color)', opacity: 0.5 }} />
              <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: 'var(--secondary-text)' }}>{t.lang}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '5px 0', justifyContent: 'center' }}>
                {Object.keys(langConfig).map(l => (
                  <button key={l} onClick={() => { setLang(l); setIsMenuOpen(false); }} className={`lang-btn ${lang === l ? 'active' : ''}`} style={{ flex: '1 1 calc(50% - 8px)', minWidth: '100px', maxWidth: '140px' }}>
                    <img src={langConfig[l].flag} alt={l} style={{ width: '18px', height: '12px', borderRadius: '2px' }} />
                    <span>{langConfig[l].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-footer">
              <button onClick={toggleTheme} className="theme-toggle-btn">
                <span>{theme === 'light' ? '🌙 ' + t.darkMode : '☀️ ' + t.lightMode}</span>
                <div style={{ width: '40px', height: '20px', background: theme === 'light' ? '#ccc' : '#4cc9f0', borderRadius: '20px', position: 'relative' }}>
                  <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: theme === 'light' ? '2px' : '22px', transition: '0.3s' }}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="search-container">
        <input type="text" placeholder={t.search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
        <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '10px', paddingTop: '10px' }}>
          {["Hepsi", "Elektronik", "Giyim", "Aksesuar", "Kozmetik"].map((c, i) => {
             const keys = { "Hepsi": "all", "Elektronik": "elec", "Giyim": "cloth", "Aksesuar": "acc", "Kozmetik": "cos" };
             return <button key={c} onClick={() => setFilter(c)} className={`filter-btn ${filter === c ? 'active' : ''}`}>{t.categories[keys[c]]}</button>
          })}
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', padding: '10px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="product-card">
            <img onClick={() => setSelectedProduct(item)} src={item.image} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '15px' }} />
            <h4 className="product-title">{item.names[lang] || item.names['tr']}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="product-price">{item.price} TMT</span>
              <button onClick={() => setCart([...cart, item])} className="add-to-cart-btn">+</button>
            </div>
          </div>
        ))}
      </div>

     {/* PRODUCT DETAIL MODAL */}
{selectedProduct && (
  <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button onClick={() => setSelectedProduct(null)} className="close-btn">&times;</button>
      <div className="modal-scroll-area">
        <img src={selectedProduct.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px' }} />
        <h3 style={{ margin: '5px 0', color: 'var(--text-color)' }}>{selectedProduct.names[lang] || selectedProduct.names['tr']}</h3>
        <div style={{ color: '#f1c40f', marginBottom: '15px', fontSize: '18px' }}>⭐ {selectedProduct.stars}</div>
        
        <h4 style={{ borderLeft: '4px solid var(--accent-color)', paddingLeft: '10px', color: 'var(--text-color)', marginBottom: '10px' }}>{t.reviews}</h4>
        
        {/* YORUM EKLEME ALANI */}
        <div className="comment-box">
          <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
            {[1,2,3,4,5].map(num => (
              <span key={num} onClick={() => setNewRating(num)} style={{ cursor: 'pointer', fontSize: '20px', color: num <= newRating ? '#f1c40f' : '#ccc' }}>
                {num <= newRating ? '★' : '☆'}
              </span>
            ))}
          </div>
          <textarea 
            value={newReview} 
            onChange={(e) => setNewReview(e.target.value)} 
            placeholder={t.commentPlaceholder} /* Dile göre değişen placeholder */
          ></textarea>
          <button onClick={() => addComment(selectedProduct.id)} className="send-comment-btn">{t.send}</button> {/* Dile göre değişen buton */}
        </div>

        {/* KULLANICI YORUMLARI */}
        {(userReviews[selectedProduct.id] || []).map((rev, i) => (
          <div key={'u'+i} className="review-item">
            <div style={{ color: '#f1c40f', fontSize: '12px' }}>{'★'.repeat(rev.stars)}{'☆'.repeat(5-rev.stars)}</div>
            <strong>{t.yourReview}:</strong> {rev.text} {/* Dile göre değişen etiket */}
          </div>
        ))}

        {/* HAZIR YORUMLAR */}
        {(selectedProduct.specificReviews?.[lang] || []).map((txt, i) => (
          <div key={'s'+i} className="review-item">
            <div style={{ color: '#f1c40f', fontSize: '12px' }}>★★★★★</div>
            <strong>{t.customer}:</strong> {txt}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      {/* Diğer modallar ve sepet aynı kalıyor... */}
      {/* (Kodun geri kalanını aynen muhafaza edin) */}

      {/* CART BAR */}
      {cart.length > 0 && (
        <div className="cart-bar">
          <div style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>{cart.reduce((s,i)=>s+i.price,0)} TMT</div>
          <button onClick={() => setIsCartOpen(true)} className="open-cart-btn">{t.cart} ({cart.length})</button>
        </div>
      )}

     {/* CART MODAL - GÜNCEL VE HATASIZ VERSİYON */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-modal-content" onClick={e => e.stopPropagation()}>
            {/* BAŞLIK ALANI */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
               <h3 style={{ margin: 0, color: 'var(--text-color)' }}>{t.cart}</h3>
               <button onClick={()=>setIsCartOpen(false)} style={{ border: 'none', background: 'none', fontSize: '24px', color: 'var(--text-color)' }}>&times;</button>
            </div>

            {/* SEPET İÇERİĞİ */}
            <div className="modal-scroll-area">
              {cart.length === 0 ? (
                /* SEPET BOŞSA: Bu mesaj ve ikon görünür */
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-color)' }}>
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>🛒</div>
                  <p style={{ fontWeight: 'bold' }}>{t.emptyCart}</p>
                </div>
              ) : (
                /* SEPET DOLUYSA: Ürünler listelenir */
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                    <img src={item.image} style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                    <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-color)' }}>
                      <strong>{item.names[lang]}</strong><br/>{item.price} TMT
                    </div>
                    <button 
                      onClick={()=>{let n=[...cart]; n.splice(idx,1); setCart(n)}} 
                      style={{ border: 'none', color: 'red', background: 'none', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ALT BUTON ALANI */}
            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '10px' }}>
              {cart.length > 0 ? (
                /* SEPETTE ÜRÜN VARSA: SATIN AL (YEŞİL) */
                <button 
                  onClick={handleCheckout} 
                  style={{ width: '100%', background: 'var(--success-color)', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {t.buy} ({cart.reduce((total, item) => total + item.price, 0)} TMT)
                </button>
              ) : (
                /* SEPET BOŞSA: KAPAT (GRİ) */
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  style={{ width: '100%', background: '#888', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {t.close}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showOrderSuccess && (
        <div className="modal-overlay" onClick={() => setShowOrderSuccess(false)}>
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '50px' }}>✅</h1>
            <h2>{t.orderMsg}</h2>
            <button onClick={() => setShowOrderSuccess(false)} className="open-cart-btn">{t.close}</button>
          </div>
        </div>
      )}
      {/* HAKKIMIZDA MODALI */}
{showAbout && (
  <div className="modal-overlay" onClick={() => setShowAbout(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setShowAbout(false)}>×</button>
      <h2>{t.about}</h2>
      <div className="info-modal-text">
        {t.aboutContent}
      </div>
    </div>
  </div>
)}

{/* İLETİŞİM MODALI */}
{showContact && (
  <div className="modal-overlay" onClick={() => setShowContact(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setShowContact(false)}>×</button>
      <h2>{t.contact}</h2>
      <div className="info-modal-text">
        {t.contactContent}
      </div>
    </div>
  </div>
)}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('react-app'));
root.render(<App />);
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './App.css'; 

// 手動設定商品
const PRODUCTS = [
    { id: 1, name: '陳年老烏龍', price: 1200, picture:'/images/S__134553607.jpg', producing:'杉林溪', desc: '炭火烘培出的手工功夫老茶，回甘強烈茶香濃郁' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [status, setStatus] = useState(''); // 用來顯示發送狀態

  // 加入購物車邏輯
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`已將 ${product.name} 加入清單`);
  };

  // 計算總金額
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // 處理表單輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 送出訂單 (發送 Email)
  const sendOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('您的購物車是空的喔！');
      return;
    }

    setStatus('訂單傳送中...');

    // 準備要寄出的資料內容
    const templateParams = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: formData.address,
      order_details: cart.map(item => `${item.name} ($${item.price})`).join(', '),
      total_price: totalPrice,
    };

    // 使用 EmailJS 發送 
    emailjs.send(
      'YOUR_SERVICE_ID',      
      'YOUR_TEMPLATE_ID',    
      templateParams,
      'YOUR_USER_ID'        
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setStatus('訂單已成功送出！我們會盡快聯繫您。');
      setCart([]); // 清空購物車
      setFormData({ name: '', phone: '', address: '' }); // 清空表單
    }, (err) => {
      console.log('FAILED...', err);
      setStatus('發生錯誤，請稍後再試，或直接聯繫我們。');
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: '"Noto Serif TC", serif', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* 標題區 */}
      <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #8b5a2b', paddingBottom: '20px' }}>
        <h1 style={{ color: '#5c4033' }}>🕰️ 陳年功夫老茶 - 限時特賣</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>歲月靜好，一杯好茶。堅持傳統炭焙工藝。</p>
      </header>

      {/* 商品列表區 */}
      <section>
        <h2 style={{ color: '#8b5a2b' }}>精選茶品</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {PRODUCTS.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <h3>{product.name}</h3>
                  <img src={product.picture} alt={product.name} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
              <p style={{ color: '#888' }}>{product.desc}</p>
              <p style={{ color: '#888' }}>產地: {product.producing}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>NT$ {product.price}</p>
              <button 
                onClick={() => addToCart(product)}
                style={{ backgroundColor: '#8b5a2b', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer', width: '100%', borderRadius: '4px' }}
              >
                加入訂單
              </button>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px dashed #ccc' }} />

      {/* 結帳表單區 */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ color: '#8b5a2b' }}>填寫訂購資料</h2>
        
        {/* 顯示購物車摘要 */}
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
          <strong>目前選擇：</strong>
          {cart.length === 0 ? <span>(尚未選擇商品)</span> : cart.map(item => item.name).join(', ')}
          <br />
          <strong style={{ fontSize: '1.2rem', color: '#d32f2f' }}>總金額：NT$ {totalPrice}</strong>
        </div>

        <form onSubmit={sendOrder}>
          <div style={{ marginBottom: '15px' }}>
            <label>收件人姓名：</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>聯絡電話：</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              value={formData.phone} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>寄送地址：</label>
            <textarea 
              name="address" 
              required 
              value={formData.address} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '15px', fontSize: '1.1rem', width: '100%', cursor: 'pointer', borderRadius: '5px' }}
          >
            確認送出訂單
          </button>
        </form>

        {status && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', color: status.includes('成功') ? 'green' : 'red' }}>{status}</p>}
      </section>
    </div>
  );
}

export default App;
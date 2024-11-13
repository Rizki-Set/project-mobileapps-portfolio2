const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const cors = require('cors'); // Tambahkan ini

const app = express();

app.use(bodyParser.json());

// Mengizinkan semua origin
app.use(cors()); // Tambahkan ini

// Atau, untuk mengizinkan hanya origin tertentu
// app.use(cors({
//   origin: 'http://localhost:8100'
// }));

// Inisialisasi Midtrans
const midtrans = new midtransClient.Snap({
  isProduction: false, // gunakan true untuk produksi
  serverKey: 'SB-Mid-server-UXnwB_vfiBsm0lASsiqhnuW3',
  clientKey: 'SB-Mid-client-REUhG5MYHp226WgM'
});

// Endpoint untuk membuat payment intent
app.post('/create-payment-intent', async (req, res) => {
  const { orderId, grossAmount } = req.body;

  const transaction = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount
    },
    // Tambahkan detail lain sesuai kebutuhan
  };

  try {
    const snapResponse = await midtrans.createTransaction(transaction);
    res.json({
      token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
      clientSecret: snapResponse.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent.' });
  }
});

// Endpoint untuk menangani callback dari Midtrans
app.post('/payment-callback', (req, res) => {
  const notification = req.body;

  // Tangani notifikasi dari Midtrans
  console.log('Payment notification:', notification);

  // Logika untuk memproses notifikasi pembayaran
  // Misalnya, update status pesanan di database

  res.sendStatus(200); // Acknowledge receipt of notification
});

// Endpoint untuk mendapatkan produk
app.get('/products', (req, res) => {
  console.log('GET /products endpoint hit'); // Tambahkan ini untuk debugging
  const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ];

  res.json(products);
});


// Mulai server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});


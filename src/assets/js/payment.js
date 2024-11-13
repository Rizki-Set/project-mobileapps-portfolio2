document.getElementById('payButton').addEventListener('click', async () => {
  const orderId = 'ORDER123';  // Ganti dengan ID pesanan yang sesuai
  const grossAmount = 100000;  // Ganti dengan jumlah pembayaran yang sesuai

  try {
    // Kirim request ke server untuk membuat payment intent
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId, grossAmount })
    });

    const data = await response.json();

    if (data.token) {
      // Redirect pengguna ke halaman pembayaran Midtrans
      window.snap.pay(data.token, {
        onSuccess: function(result) {
          alert("Payment success!");
          // Logika untuk menyimpan laporan order di 'order-report'
        },
        onPending: function(result) {
          alert("Payment is pending!");
        },
        onError: function(result) {
          alert("Payment failed!");
        },
        onClose: function() {
          alert('You closed the popup without finishing the payment');
        }
      });
    } else {
      console.error('Failed to get payment token');
    }
  } catch (error) {
    console.error('Error during payment:', error);
  }
});

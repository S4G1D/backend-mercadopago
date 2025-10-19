// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mercadopago from "mercadopago";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Configura el SDK con tu Access Token de Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// 📦 Endpoint para crear una preferencia de pago
app.post("/create_preference", async (req, res) => {
  try {
    const { title, price, quantity } = req.body;

    const preference = {
      items: [
        {
          title,
          unit_price: Number(price),
          quantity: Number(quantity),
          currency_id: "250.000 COP",
        },
      ],
      back_urls: {
        success: "https://lavidaunbaile.com/success",
        failure: "https://lavidaunbaile.com/failure",
        pending: "https://lavidaunbaile.com/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando la preferencia" });
  }
});

// 🌐 Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});


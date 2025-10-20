import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();

app.use(cors({
  origin: ["https://lavidaunbaile.com", "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Configura tu Access Token
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.post("/create_preference", async (req, res) => {
  try {
    const { title, price, quantity } = req.body;

    const preference = {
      items: [
        {
          title,
          quantity,
          currency_id: "COP",
          unit_price: price,
        },
      ],
      back_urls: {
        success: "https://lavidaunbaile.com/success.html",
        failure: "https://lavidaunbaile.com/error.html",
        pending: "https://lavidaunbaile.com/pending.html",
      },
      auto_return: "approved",
    };

    const result = await mercadopago.preferences.create(preference);
    res.json({ init_point: result.body.init_point });
  } catch (error) {
    console.error("Error creando la preferencia:", error);
    res.status(500).json({ error: "Error creando la preferencia" });
  }
});

app.listen(3000, () => console.log("🚀 Servidor escuchando en puerto 3000"));

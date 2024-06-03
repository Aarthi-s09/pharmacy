const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://Aarthis09:Aarthi1234@cluster0.kexotzh.mongodb.net/HospitalAppointment?retryWrites=true&w=majority&appName=Cluster00', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const medicineSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String
});

const Medicine = mongoose.model('Medicine', medicineSchema);

const cartSchema = new mongoose.Schema({
  medicines: [medicineSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

app.post('/add-to-cart', async (req, res) => {
  const { id, name, price, image } = req.body;
  let cart = await Cart.findOne({});
  if (!cart) {
    cart = new Cart({ medicines: [] });
  }
  cart.medicines.push({ id, name, price, image });
  await cart.save();
  res.status(200).send(cart);
});

app.get('/get-cart', async (req, res) => {
  const cart = await Cart.findOne({});
  res.status(200).send(cart ? cart.medicines : []);
});

app.post('/clear-cart', async (req, res) => {
  await Cart.deleteOne({});
  res.status(200).send({ message: 'Cart cleared' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

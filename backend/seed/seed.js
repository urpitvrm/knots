require('dotenv').config();
const { connectDB } = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const example = {
  categories: ['Bags', 'Flowers', 'Plushies', 'Home Decor'],
  products: [
    {
      name: 'Blush Pink Crochet Flower Bouquet',
      description: 'Handmade crochet bouquet with blush pink tones. Perfect gift.',
      price: 29.99,
      category: 'Flowers',
      images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format'],
      stock: 25
    },
    {
      name: 'Sage Green Mini Tote Bag',
      description: 'Cozy mini tote with soft handles. Fits phone and wallet.',
      price: 39.0,
      category: 'Bags',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format'],
      stock: 12
    },
    {
      name: 'Cream Teddy Plushie',
      description: 'Adorable cream-colored teddy plush, made with love.',
      price: 24.5,
      category: 'Plushies',
      images: ['https://images.unsplash.com/photo-1616087418106-238bc58a93d3?q=80&w=1200&auto=format'],
      stock: 30
    },
    {
      name: 'Sage Coaster Set (4)',
      description: 'Soft pastel crochet coasters to cozy up your table.',
      price: 18.75,
      category: 'Home Decor',
      images: ['https://images.unsplash.com/photo-1540979388789-6cee28a1cdc7?q=80&w=1200&auto=format'],
      stock: 40
    }
  ]
};

async function seed() {
  await connectDB(process.env.MONGO_URI);

  // Categories
  const existingCategories = await Category.find();
  const nameToId = new Map(existingCategories.map((c) => [c.name, c._id]));
  for (const name of example.categories) {
    if (!nameToId.has(name)) {
      const c = await Category.create({ name });
      nameToId.set(name, c._id);
    }
  }

  // Products
  const countProducts = await Product.countDocuments();
  if (countProducts === 0) {
    const docs = example.products.map((p) => ({
      ...p,
      category: nameToId.get(p.category)
    }));
    await Product.insertMany(docs);
    // eslint-disable-next-line no-console
    console.log('Seeded products and categories.');
  } else {
    // eslint-disable-next-line no-console
    console.log('Products already exist, skipping seeding.');
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seed };

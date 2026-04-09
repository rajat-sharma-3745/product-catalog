#!/usr/bin/env node

/*
Demo barcodes (exact strings from .cursor/DECISIONS.md):
8901234567890
8901234567891
8901234567892
8901234567893
8901234567894
8901234567895
8901234567896
8901234567897
8901234567898
8901234567899
*/

import mongoose from 'mongoose';
import { connectDb } from '../src/config/db.js';
import Product from '../src/models/Product.js';
import '../src/models/Payment.js';
import '../src/models/CatalogItem.js';

const seedProducts = [
  {
    name: 'Whole Wheat Bread',
    barcode: '8901234567890',
    price: 45,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh whole wheat bread loaf',
  },
  {
    name: 'Organic Milk 1L',
    barcode: '8901234567891',
    price: 62,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    description: 'Pasteurized full cream organic milk',
  },
  {
    name: 'Basmati Rice 5kg',
    barcode: '8901234567892',
    price: 499,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1705338026411-00639520a438?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Premium aged basmati rice',
  },
  {
    name: 'Sunflower Cooking Oil 1L',
    barcode: '8901234567893',
    price: 165,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'Refined sunflower cooking oil',
  },
  {
    name: 'Instant Oats 500g',
    barcode: '8901234567894',
    price: 120,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',
    description: 'Quick-cook healthy oats',
  },
  {
    name: 'Dark Chocolate 100g',
    barcode: '8901234567895',
    price: 95,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    description: '70% cocoa dark chocolate bar',
  },
  {
    name: 'Ground Coffee 250g',
    barcode: '8901234567896',
    price: 320,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    description: 'Medium roast ground coffee',
  },
  {
    name: 'Mineral Water 1L',
    barcode: '8901234567897',
    price: 20,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
    description: 'Packaged mineral drinking water',
  },
  {
    name: 'Greek Yogurt 400g',
    barcode: '8901234567898',
    price: 135,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    description: 'High-protein plain Greek yogurt',
  },
  {
    name: 'Tomato Ketchup 500g',
    barcode: '8901234567899',
    price: 110,
    currency: 'INR',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1568584952743-6e30d4f404eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dG9tYXRvJTIwa2V0Y2h1cHxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Classic tomato ketchup bottle',
  },
];

async function seed() {
  await connectDb();

  const operations = seedProducts.map((product) =>
    Product.updateOne(
      { barcode: product.barcode },
      { $set: product },
      { upsert: true }
    )
  );

  const results = await Promise.all(operations);
  const upsertedCount = results.filter((result) => result.upsertedCount > 0).length;

  console.log(
    `Seed complete: processed ${seedProducts.length} products (${upsertedCount} new, ${seedProducts.length - upsertedCount} updated)`
  );
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });

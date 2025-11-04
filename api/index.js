const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const uri = process.env.MONGODB_URI;
const googleSheetsUrl = process.env.GOOGLE_SHEETS_URL; // MODIFIED: Use environment variable

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("tokopercetakan21_db");
    
    // --- Serve Static Files ---
    // Vercel will handle this, but this makes it runnable locally too
    app.use(express.static(path.join(__dirname, '..')));

    // --- API Endpoints ---
    const transactionsCollection = db.collection("transactions");
    const ordersCollection = db.collection("orders");
    const expensesCollection = db.collection("expenses");
    const shiftsCollection = db.collection("shifts");

    // Test endpoint
    app.get('/api', (req, res) => {
      res.send('Hello from tokopercetakan21 backend API!');
    });

    // Endpoint for adding a transaction
    app.post('/api/transactions', async (req, res) => {
      const transactionData = req.body;
      try {
        const mongoResult = await transactionsCollection.insertOne(transactionData);
        res.status(201).json({ 
          message: 'Transaction saved to MongoDB successfully', 
          mongoId: mongoResult.insertedId 
        });
        if (googleSheetsUrl) {
          axios.post(googleSheetsUrl, {
            action: 'addTransaction',
            data: transactionData
          }, { headers: { 'Content-Type': 'application/json' } })
          .catch(error => {
            console.error('Error forwarding transaction to Google Sheets:', error.message);
          });
        }
      } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ message: 'Error saving transaction', error });
      }
    });

    // Endpoint for getting all transactions
    app.get('/api/transactions', async (req, res) => {
      try {
        const transactions = await transactionsCollection.find({}).sort({ timestamp: -1 }).toArray();
        res.status(200).json(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error });
      }
    });

    // Endpoint for adding a complex order
    app.post('/api/orders', async (req, res) => {
      const orderData = req.body;
      try {
        const mongoResult = await ordersCollection.insertOne(orderData);
        res.status(201).json({ 
          message: 'Order saved to MongoDB successfully', 
          mongoId: mongoResult.insertedId 
        });
        if (googleSheetsUrl) {
          axios.post(googleSheetsUrl, {
            action: 'addOrder',
            data: orderData
          }, { headers: { 'Content-Type': 'application/json' } })
          .catch(error => {
            console.error('Error forwarding order to Google Sheets:', error.message);
          });
        }
      } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Error saving order', error });
      }
    });

    // Endpoint for getting all orders
    app.get('/api/orders', async (req, res) => {
      try {
        const orders = await ordersCollection.find({}).sort({ timestamp: -1 }).toArray();
        res.status(200).json(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
      }
    });

    // Endpoint for adding an expense
    app.post('/api/expenses', async (req, res) => {
      const expenseData = req.body;
      try {
        const mongoResult = await expensesCollection.insertOne(expenseData);
        res.status(201).json({ 
          message: 'Expense saved to MongoDB successfully', 
          mongoId: mongoResult.insertedId 
        });
        if (googleSheetsUrl) {
          axios.post(googleSheetsUrl, {
            action: 'addExpense',
            data: expenseData
          }, { headers: { 'Content-Type': 'application/json' } })
          .catch(error => {
            console.error('Error forwarding expense to Google Sheets:', error.message);
          });
        }
      } catch (error) {
        console.error('Error saving expense:', error);
        res.status(500).json({ message: 'Error saving expense', error });
      }
    });

    // Endpoint for shifts
    app.post('/api/shifts', async (req, res) => {
      const shiftData = req.body;
      try {
        const mongoResult = await shiftsCollection.insertOne(shiftData.data);
        res.status(201).json({ 
          message: 'Shift data saved to MongoDB successfully', 
          mongoId: mongoResult.insertedId 
        });
        if (googleSheetsUrl) {
          axios.post(googleSheetsUrl, shiftData, { headers: { 'Content-Type': 'application/json' } })
          .catch(error => {
            console.error('Error forwarding shift data to Google Sheets:', error.message);
          });
        }
      } catch (error) {
        console.error('Error saving shift data:', error);
        res.status(500).json({ message: 'Error saving shift data', error });
      }
    });
    
    // Serve frontend for any other GET request
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'index.html'));
    });

  } catch (e) {
    console.error("Error connecting to database or setting up routes", e);
  }
}

run().catch(console.dir);

// Export the app for Vercel
module.exports = app;

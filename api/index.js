require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Basic Middleware
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection Logic
const uri = process.env.MONGODB_URI;
const GOOGLE_SHEETS_WEB_APP_URL = process.env.GOOGLE_SHEETS_WEB_APP_URL;

if (!uri) {
    console.error('FATAL ERROR: MONGODB_URI is not defined. Please check your .env file.');
    process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runMongoConnection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}
runMongoConnection().catch(console.dir);

// Diagnostic test route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// 3. API Routes

// Endpoint for receiving data (from kasir pages)
app.post('/api', async (req, res) => {
  const { action, data } = req.body;
  if (!action || !data) {
    return res.status(400).json({ message: 'Missing action or data in request body.' });
  }

  const db = client.db("tokopercetakan21");
  let collectionName;

  switch (action) {
    case 'addTransaction': collectionName = 'transactions'; break;
    case 'addExpense': collectionName = 'expenses'; break;
    case 'addOrder': collectionName = 'orders'; break;
    case 'startShift':
    case 'closeShift': collectionName = 'shifts'; break;
    default: collectionName = 'unknown_actions'; break;
  }

  try {
    // Save to MongoDB
    const mongoResult = await db.collection(collectionName).insertOne(data);
    console.log(`MongoDB: Action '${action}' saved to '${collectionName}' with ID:`, mongoResult.insertedId);

    // Forward to Google Sheets
    if (GOOGLE_SHEETS_WEB_APP_URL) {
      // TODO: Re-enable this block once the Google Sheets endpoint is functional.
      // To fix the data consistency bug, the logic should be awaited and must
      // throw an error on failure to prevent the client from getting a success response.
      /*
      try {
        await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        });
        console.log('Successfully forwarded data to Google Sheets.');
      } catch (gsError) {
        console.error('Error forwarding to Google Sheets:', gsError.message);
      }
      */
      console.log('Skipping Google Sheets forwarding as it is temporarily disabled.');
    } else {
      console.warn("GOOGLE_SHEETS_WEB_APP_URL not configured. Skipping forwarding.");
    }

    res.status(200).json({ message: 'Data processed successfully.' });

  } catch (error) {
    console.error(`API Error on action '${action}':`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoints for fetching data (for monitor page)
app.get('/api/transactions', async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/transactions received. Query:`, req.query);
  try {
    const db = client.db("tokopercetakan21");
    const query = {};

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      // Append time to cover the entire day for string-based timestamp queries
      const startDate = req.query.startDate + ' 00:00:00';
      const endDate = req.query.endDate + ' 23:59:59';
      query.timestamp = {
        $gte: startDate,
        $lte: endDate
      };
    }
    const data = await db.collection('transactions').find(query).sort({ timestamp: -1 }).toArray();
    console.log(`Query successful. Found ${data.length} documents.`);
    res.status(200).json(data);
  } catch (error) {
    console.error("!!! ERROR in /api/transactions:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const db = client.db("tokopercetakan21");
    const query = {};

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      // Append time to cover the entire day for string-based timestamp queries
      const startDate = req.query.startDate + ' 00:00:00';
      const endDate = req.query.endDate + ' 23:59:59';
      query.timestamp = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (req.query.admin) {
      query.admin = req.query.admin;
    }
    
    const data = await db.collection('orders').find(query).sort({ timestamp: -1 }).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/shifts', async (req, res) => {
  try {
    const db = client.db("tokopercetakan21");
    const query = {};

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: req.query.startDate,
        $lte: req.query.endDate
      };
    }

    if (req.query.cashier) {
      query.cashier = req.query.cashier;
    }
    
    const data = await db.collection('shifts').find(query).sort({ date: -1 }).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { ObjectId } = require('mongodb'); // Add this at the top with other requires

// ... (existing code) ...

// Endpoint for updating an order (for status changes)
app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { metode, panjar, sisa } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Order ID format.' });
  }

  if (!metode) {
    return res.status(400).json({ message: "'metode' (status) is required." });
  }

  try {
    const db = client.db("tokopercetakan21");
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { metode, panjar, sisa } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    console.log(`Order ${id} updated successfully. New status: ${metode}`);
    res.status(200).json({ message: 'Order updated successfully.' });

  } catch (error) {
    console.error(`!!! ERROR in PATCH /api/orders/${id}:`, error);
    res.status(500).json({ message: 'Internal server error during order update.' });
  }
});


// Endpoint for cron job to delete old data
app.post('/api/cron/delete-old-data', async (req, res) => {
  // 1. Security Check
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('CRON_SECRET is not configured. Aborting deletion job.');
    return res.status(500).json({ message: 'Cron secret not configured on server.' });
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized attempt to run cron job.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. Deletion Logic
  try {
    const db = client.db("tokopercetakan21");
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Format to 'YYYY-MM-DD HH:MM:SS' to match the string format in the database
    const pad = (num) => num.toString().padStart(2, '0');
    const twoMonthsAgoDateString = `${twoMonthsAgo.getFullYear()}-${pad(twoMonthsAgo.getMonth() + 1)}-${pad(twoMonthsAgo.getDate())} ${pad(twoMonthsAgo.getHours())}:${pad(twoMonthsAgo.getMinutes())}:${pad(twoMonthsAgo.getSeconds())}`;

    const query = { timestamp: { $lt: twoMonthsAgoDateString } };

    console.log(`[CRON JOB] Deleting documents with timestamp before ${twoMonthsAgoDateString}`);

    // Delete from transactions
    const deletedTransactions = await db.collection('transactions').deleteMany(query);
    // Delete from orders
    const deletedOrders = await db.collection('orders').deleteMany(query);

    const result = {
      message: 'Cron job for old data deletion completed successfully.',
      deletedTransactionsCount: deletedTransactions.deletedCount,
      deletedOrdersCount: deletedOrders.deletedCount,
    };

    console.log('[CRON JOB] Result:', result);
    res.status(200).json(result);

  } catch (error) {
    console.error('[CRON JOB] Error during old data deletion:', error);
    res.status(500).json({ message: 'Internal server error during cron job execution.' });
  }
});

// New: Endpoint to delete ALL data (transactions, orders, shifts)
app.delete('/api/data', async (req, res) => {
  try {
    const db = client.db("tokopercetakan21");

    const deletedTransactions = await db.collection('transactions').deleteMany({});
    const deletedOrders = await db.collection('orders').deleteMany({});
    const deletedShifts = await db.collection('shifts').deleteMany({});

    const result = {
      message: 'All data (transactions, orders, shifts) deleted successfully.',
      deletedTransactionsCount: deletedTransactions.deletedCount,
      deletedOrdersCount: deletedOrders.deletedCount,
      deletedShiftsCount: deletedShifts.deletedCount,
    };

    console.log('[DELETE ALL DATA] Result:', result);
    res.status(200).json(result);

  } catch (error) {
    console.error('[DELETE ALL DATA] Error during all data deletion:', error);
    res.status(500).json({ message: 'Internal server error during all data deletion.' });
  }
});


// 4. Static File Serving (for local development)
// This should come after API routes
app.use(express.static(path.join(__dirname, '..')));

// 5. Server Listener (for local development)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 6. Vercel Export
module.exports = app;
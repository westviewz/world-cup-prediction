const mongoose = require('mongoose');

async function checkDb() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/worldcup2026');
    console.log('Connected to worldcup2026');
    
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    const colNames = collections.map(c => c.name);
    console.log('Collections in worldcup2026:', colNames);
    
    if (colNames.includes('admins')) {
      const admins = await db.collection('admins').find().toArray();
      console.log('Admins collection count:', admins.length);
    }
    
    if (colNames.includes('predictions')) {
      const predictions = await db.collection('predictions').find().toArray();
      console.log('Predictions collection count:', predictions.length);
    }
    
    if (colNames.includes('settings')) {
      const settings = await db.collection('settings').find().toArray();
      console.log('Settings collection count:', settings.length);
    }

    console.log('Check complete');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
checkDb();

const mongoose = require('mongoose');

async function revertDb() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/worldcup2026');
    console.log('Connected to worldcup2026');
    
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    const colNames = collections.map(c => c.name);
    
    if (colNames.includes('admins')) {
      await db.collection('admins').drop();
      console.log('Dropped admins collection');
    }
    
    if (colNames.includes('predictions')) {
      await db.collection('predictions').drop();
      console.log('Dropped predictions collection');
    }
    
    if (colNames.includes('settings')) {
      await db.collection('settings').drop();
      console.log('Dropped settings collection');
    }

    console.log('Database reverted to original state!');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
revertDb();

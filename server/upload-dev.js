const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const modal = require('./Model/userModel');

const fs = require('fs');
const devData = JSON.parse(fs.readFileSync('./Dev-data/users.json', 'utf-8'));
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB is running'));

const importData = async () => {
  try {
    await modal.create(devData, { validateBeforeSave: false });
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await modal.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

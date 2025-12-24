const mongoose = require('mongoose');
const fs = require('fs');

const foodSchema = new mongoose.Schema({
  name: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  price: Number
});

const Food = mongoose.model('Food', foodSchema);


async function saveStaticImage(name , photo , price) {
  await mongoose.connect('mongodb://127.0.0.1:27017/UniversitySystem');

  

  const foodPhoto = new Food({
    name,
    image: {
      data: fs.readFileSync(photo),
      contentType: 'image/jpeg',
    },
    price
  });

  await foodPhoto.save();
  console.log('Image saved to MongoDB!');
}

saveStaticImage( "چلوکباب" , './image/food1.jpg' , 85000);
saveStaticImage( "قرمه سبزی" , './image/food2.jpg' , 95000);

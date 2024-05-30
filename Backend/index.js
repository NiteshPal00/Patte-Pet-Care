import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
// Home
import carouselrouter from './routers/Home/carousel.routers';
import roundCircleRouter from './routers/Home/roundCircle.routers'
import welcomeRouter from './routers/Home/welcome.routers';
import clientRouter from './routers/Home/clients.routers';
import blogrouter from './routers/Home/blog.routers';
import blogroute from './routers/Home/blog1.routers';
import instaRouter from './routers/Home/insta.routers';
import teamsRouter from './routers/Home/teams.routers';
// About
import aboutRouter from './routers/About/about.routers';
import healthRouter from './routers/Blog/health.routers';
// Shop
import catRouter from './routers/Shop/cat.routers';
import dogRouter from './routers/Shop/dog.router';
import petsRouter from './routers/Shop/pet.routers';
import petSinRouter from './routers/Shop/petSin.routers';
import allShopRouter from './routers/Shop/allShop.routers';
import cartRouter from './routers/carts.routers';
import userRouter from './routers/users.routers';
import wishlistRouter from './routers/wishlist.routers';
import checkoutRouter from './routers/orders.routers';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname))
const port = 8003;

app.get('/', (req, res) => {
    res.send("Welcome to Server's");
})

mongoose.connect('mongodb://127.0.0.1:27017/Patte_Project')
    .then(() => console.log('Connected!'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
// Home
app.use(carouselrouter);
app.use(roundCircleRouter);
app.use(welcomeRouter);
app.use(clientRouter);
app.use(blogrouter);
app.use(blogroute);
app.use(instaRouter);
app.use(teamsRouter);

// About
app.use(aboutRouter);
app.use(healthRouter);

// Shop
app.use(allShopRouter);
app.use(catRouter);
app.use(dogRouter);
app.use(petsRouter);
app.use(petSinRouter);

// Cart
app.use(cartRouter);
// User
app.use(userRouter);
// WishList
app.use(wishlistRouter)
// Checkout
app.use(checkoutRouter)
require('dotenv').config();
const express = require('express')
const app = express();
const userModel = require('./models/user')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
    res.status(201).json({ message: 'Hello Welcome To Api' })
})

app.post('/signup', async (req, res) => {
    try {
        let { name, email, password } = req.body;

        let user = new userModel({ name, email, password });
        await user.save();
        res.status(201).json({ message: "user Data Added SuccessFully", user })
    } catch (error) {
        res.status(501).json({ message: error.message })
    }
})

app.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User Not Found' })
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "User Password Is Incorrect" })
        }
        return res.status(201).json({ message: "User Login SuccessFully" ,user})
    } catch (error) {
        res.status(501).json({ message: error.message })

    }
})

app.get('/user/:id?', async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            let user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User Not Found' });
            }
            return res.status(200).json(user);
        } else {
            let users = await userModel.find({});
            return res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        let user = await userModel.findByIdAndUpdate(id, { name, email, password }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        res.status(200).json({ message: "User Updated Successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        let user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(process.env.PORT,()=>{
    console.log('connected')
})
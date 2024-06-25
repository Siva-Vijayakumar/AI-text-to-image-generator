import express from "express";
import axios from "axios";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index", { imageUrl: null });
});

app.post("/search", async (req, res) => {
    let words = req.body['word'];

    try {
        const response = await axios.post(
            `https://api.limewire.com/api/image/generation`,
            {
                prompt: words,  // Ensure prompt is a string, not an object
                aspect_ratio: '1:1'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Version': 'v1',
                    Accept: 'application/json',
                    Authorization: 'Bearer lmwr_sk_IxZPCwH3fM_dewJytzaGdIxTOJZFEokLzAg4bZM2LjJmVeWR'  // Replace with your actual API key
                }
            }
        );

        const datas = response.data;
        console.log(datas);

        // Check if 'data' array exists and has at least one element
        if (datas && datas['data'] && datas['data'].length > 0) {
            let imageUrl = datas['data'][0]['asset_url'];
            res.render("index", { imageUrl: imageUrl });
        } else {
            throw new Error('No image URL found in response');
        }
    } catch (error) {
        console.error("Error fetching data from Limewire API:", error.message);
        res.status(500).send("Error fetching data from Limewire API: " + error.message);
    }
});

app.listen(3000, () => {
    console.log("server is running!");
});

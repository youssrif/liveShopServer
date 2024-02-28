import express from 'express';
import AWS from 'aws-sdk';


const app = express();
import { config } from "dotenv";
config();
const nodeenv = process.env.NODE_ENV;
const port = 3003;

// Middleware to parse incoming JSON requests
app.use(express.json());
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// Simple route
app.get('/ping', (req, res) => {
    res.send('pong!');
});
console.log("thi sis tnhr  ceredentio ",)

const ivs = new AWS.IVS({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
})

app.post('/test', async (req, res) => {
    const params = {
        name: 'MyIVSChannel', // Replace with your desired channel name
    };
    ivs.createChannel({ name: 'MyIVSChannel' }, (err, data) => {
        if (err) {
            console.error('Error creating IVS channel:', err, process.env.AWS_SECRET_ACCESS_KEY);
            res.status(400).send('Error creating IVS channel:',)
        } else {
            console.log('IVS channel created successfully:', data.channel);
            res.status(200).send({
                streamKeyArn: data.channel.arn,
                streamKey: data.streamKey.value,
            })
        }
    });
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
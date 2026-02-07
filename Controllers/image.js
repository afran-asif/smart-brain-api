const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();

const handleApiCall = (req, res) => {
    metadata.set("authorization", "Key " + process.env.CLARIFAI_PAT);

    stub.PostModelOutputs(
    {
        user_app_id: {
            user_id: process.env.CLARIFAI_USER_ID ,
            app_id: process.env.CLARIFAI_APP_ID
        },
        model_id: "face-detection",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
        (err, response) => {
            if (err) {
                return res.status(500).json({error: "gRPC error: " + err});
            }

            if (response.status.code !== 10000) {
                return res.status(400).json({
                    error: "API failed: " + response.status.description,
                    details: response.status.details
                });
            }

            res.json(response);
        }
    );
}

const handleImage = (req ,res, db) => {
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}
module.exports = {
    handleImage,
    handleApiCall
}









//     const { input } = req.body;
// const raw = JSON.stringify({
//     "user_app_id": {
//         "user_id": USER_ID,
//         "app_id": APP_ID
//     },
//     "inputs": [
//         {
//             "data": {
//                 "image": {
//                     "url": input
//                 }
//             }
//         }
//     ]
// });

// const requestOptions = {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Key ' + PAT
//     },
//     body: raw
// };

//     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
//     .then(response => response.json())
//     .then(data => {
//         res.json(data);
//     })
//     .catch( err => res.status(400).json('unable to work with API'))
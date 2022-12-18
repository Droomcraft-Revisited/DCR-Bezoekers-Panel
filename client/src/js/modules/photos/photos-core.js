import axios from 'axios';



export function getPhotos(uuid, endpoint) {

    console.log('GETTING PHOTOS INITIALI1ZED');

    axios.post(endpoint, {
        uuid: uuid
    })
        .then(function (response) {
            let data = response.data;
            console.log('[DCR] Data from photos = ' + JSON.stringify(data, null, 4));

        }).catch(function (error) {
            if (error){
                console.error(error)
                throw error;
            }
    });

}
import axios from 'axios';

/*
                        <div class="content-card settings-card">
                            <span>
                                <!--<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> -->
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
</svg>
                                    FOTO #1
                            </span>
                            <div class="mx-auto content-card-content content-card-content-border-bottom">
                                <img src="https://i.imgur.com/phhx1qn.png" alt="Foto#1"">
                            </div>
                            <div class="content-card-buttons">
                                <label class="content-pill status-button">
                                    <span style="display: inline;">Download Foto</span>
                                </label>
                            </div>
                        </div>
 */

export function getPhotos(uuid, endpoint) {

    console.log('GETTING PHOTOS INITIALI1ZED');

    axios.get(endpoint + uuid)
        .then(function (response) {
            let data = response.data;
            let photos = data.photos
            console.log('[DCR] Data from photos = ' + JSON.stringify(data, null, 4));
            for (let i; i < photos.length; i++) {
                console.log('[DCR] Photo = ' + photos[i]);
                $('#photos-content').append(' <div class="content-card settings-card"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16"> <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/> <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg> FOTO #1 </span> <div class="mx-auto content-card-content content-card-content-border-bottom"> <img src="' + photos[i] + '" alt="foto#' +(photos[i]+1) + '""> </div> <div class="content-card-buttons"> <label class="content-pill status-button"> <span style="display: inline;"><a href="' + photos[i] + '">Download Foto</a></span> </label> </div> </div>')
            }
        }).catch(function (error) {
            if (error){
                console.error("[DCR PHOTOS-CORE ERR] " + error)
                throw error;
            }
    });

}
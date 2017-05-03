// jQuery Plugins
import { noConsole } from './plugins';

// App
import initMap from './app/map';


// Logic
noConsole();

// Once the Google Map script has loaded, execute initMap
const mapScript = document.getElementById('google-map');
mapScript.onload = initMap;





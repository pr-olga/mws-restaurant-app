if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js', {scope: '/mws-restaurant-stage-1/'})
        .then(function (registration) {
            console.log("Service Worker Registred", registration);
        })
.catch(function(err){
    console.log("Registration failes", err);
})

}
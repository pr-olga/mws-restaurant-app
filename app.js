if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js', {scope: '/'})
        .then(function (registration) {
            console.log("Service Worker Registred", registration);
        })
.catch(function(err){
    console.log("Registration failes", err);
})

}
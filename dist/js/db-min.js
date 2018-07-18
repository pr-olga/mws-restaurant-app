import idb from"idb";var dbPromise=idb.open("restaurant",1,function(e){e.createObjectStore("restaurants",{keyPath:"id"}).createIndex("name","name")});fetch("http://localhost:1337/restaurants").then(function(e){return e.json()}).then(e=>{dbPromise.then(function(t){var n=t.transaction("restaurants","readwrite"),r=n.objectStore("restaurants");return e.forEach(function(e){r.put(e)}),n.complete}).then(()=>{dbPromise.then(function(e){var t=e.transaction("restaurants").objectStore("restaurants");t.index("name");return t.getAll().then(function(e){e.map((t,n)=>e[n].name),e.map((t,n)=>e[n].neighborhood);const t=document.getElementById("restaurants-list");t.innerHTML="",e.forEach(e=>{const n=document.createElement("li"),r=document.createElement("h2");r.innerHTML=e.name,n.append(r);const a=document.createElement("p");a.innerHTML=e.neighborhood,n.append(a);const o=document.createElement("p");o.innerHTML=e.address,n.append(o),t.append(n)})})})}).catch(function(e){return console.log("Looks like there was a problem: \n",e),e})});
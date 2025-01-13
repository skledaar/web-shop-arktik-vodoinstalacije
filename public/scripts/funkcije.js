function ucitajKategorije() {
   ukBrArtikala();
   fetch('/getCategories')
   .then(response => response.json())
   .then(data => {
      const divKategorija = document.getElementById("izbornik");

      for(var x in data) {
         const noviButton = document.createElement('button');  //mora bit const!! inače uzme uvijek zadnji x
         noviButton.textContent = data[x];
         noviButton.id = data[x].split(" ")[0];
         noviButton.onclick = function() {
            ucitajArtikle(noviButton.textContent);
         };
         divKategorija.appendChild(noviButton);
      }
   });
};

function ucitajArtikle(naziv) {
   const divArtikala = document.getElementById("artikli");
   const trenutnaKategorija = document.getElementById("oznKategorije").textContent;
   document.getElementById("oznKategorije").innerHTML = naziv;

   if(trenutnaKategorija != "Odaberite kategoriju...") {
      document.getElementById(trenutnaKategorija.split(" ")[0]).style.fontWeight = 'normal';
   }
   document.getElementById(naziv.split(" ")[0]).style.fontWeight = 'bold';
   
   while (divArtikala.firstChild) {
      divArtikala.removeChild(divArtikala.lastChild);
   }
   fetch('/getProducts/'+naziv)
   .then(response => response.json())
   .then(data => {
      for(var x in data) {
         addElement(data[x].image, data[x].name, naziv);
      }
   });
};

function addElement(nazivSlike, nazivArtikla, nazivKategorije) {
   const noviArtikl = document.createElement("div");
   
   const slika = document.createElement("div");
   slika.style.backgroundImage = "url(images/"+nazivKategorije.replace(/ /g, "%20")+"/"+nazivSlike+")";
   
   const kosarica = document.createElement("button");
   kosarica.onclick = function() {
      dodajUKosaricu(nazivArtikla);
      fetch('/cart/articleNo/' + nazivArtikla)
         .then(response => response.json())
         .then(data => {
            if(data["no"]>1) {
               slika.removeChild(slika.lastChild);
            }
         });
      brojacArtikala();
   };

   const slikaKosarice = document.createElement("img");
   slikaKosarice.src = "images/cart.png";
   kosarica.appendChild(slikaKosarice);
   slika.appendChild(kosarica);
   
   brojacArtikala();

   noviArtikl.appendChild(slika);
   const tekst = document.createElement("h3");
   tekst.innerHTML = nazivArtikla;
   noviArtikl.appendChild(tekst);

   document.getElementById("artikli").appendChild(noviArtikl);

   function brojacArtikala() {
      fetch('/cart/articleNo/' + nazivArtikla)
         .then(response => response.json())
         .then(data => {
            br = data["no"];
            if (br > 0) {
               const brojacArtikala = document.createElement("div");
               brojacArtikala.innerHTML = br;
               slika.appendChild(brojacArtikala);
            }
         });
   }

};

function brojArtikala(nazivArtikla) {
   fetch('/cart/articleNo/'+nazivArtikla)
   .then(response => response.json())
   .then(data => {
      console.log(data["no"]);
      return data["no"];
   });
};

function kosarica() {
   document.getElementById("oznKategorije").textContent = "Košarica";
   ukBrArtikala();
   
   fetch('/cart/getAll')
   .then(response => response.json())
   .then(data => {
      const keys = Object.keys(data);
      document.getElementById("artikliUKosarici").innerHTML = "NAZIV PROIZVODA";
      document.getElementById("kolicine").innerHTML = "KOLIČINA";

      for (let key of keys) {
         const artiklUKosarici = document.createElement("p");
         artiklUKosarici.innerHTML = key;
         document.getElementById("artikliUKosarici").appendChild(artiklUKosarici);

         const kolicinaViseManje = document.createElement("div");
         const manje = document.createElement("button");
         const vise = document.createElement("button");
         manje.onclick = function() {
            makniIzKosarice(key);
            kosarica();
         };
         vise.onclick = function() {
            dodajUKosaricu(key);
            kosarica();
         };
         const slikaManje = document.createElement("img");
         const slikaVise = document.createElement("img");
         slikaManje.src = "images/minus.png";
         slikaVise.src = "images/plus.png";
         manje.appendChild(slikaManje);
         vise.appendChild(slikaVise);
         const kolicinaUKosarici = document.createTextNode(data[key]);

         kolicinaViseManje.appendChild(manje);
         kolicinaViseManje.appendChild(kolicinaUKosarici);
         kolicinaViseManje.appendChild(vise);

         document.getElementById("kolicine").appendChild(kolicinaViseManje);

      }
      });
}

function ukBrArtikala() {
   let broj = 0;
   
   fetch('/cart/itemsNo')
   .then(response => response.json())
   .then(data => {
      document.getElementById("ukArtikala").innerHTML = data["no"];
      if(data["no"] == 0) {
         document.getElementById("ukArtikala").style.visibility = 'hidden';
      } else {
         document.getElementById("ukArtikala").style.visibility = 'visible';
      }
   })
};

function dodajUKosaricu(artikl) {
   fetch('/cart/add/'+artikl, {
      method: 'POST'
   });
   ukBrArtikala();
};

function makniIzKosarice(artikl) {
   fetch('/cart/remove/'+artikl, {
      method: 'POST'
   });
   ukBrArtikala();
};
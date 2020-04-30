# Lab2Socket.io

Elin Alm, Emelie Rosenlöw, Isabel Blomström

Länk till GitHub repo: https://github.com/elinalm/Lab2Socket.io

# Vochat - en chattapp

I vår kurs Dynamisk webbutveckling har vi fått i uppdrag att bygga en chatt-applikation. Applikationen ska fungera i både backend och frontend. Vi har valt att döpa vår app till Vochat, som är en ordlek med det latinska ordet för samtal; vocat. Applikationen är klassisk, en användare skriver in sitt användarnamn och kan därefter gå in i olika rum och chatta med andra användare som finns där. Vill man så kan man skapa ett nytt rum och även sätta en specifikt lösenord på det.

## Hur vi byggde projektet

Vi har valt att bygga projektet med vanilla JavaScript, utan något stöd från ett externt ramverk. I övrigt använder vi oss av Express och socket.io. För att sätta upp projektet från start skriver vi `npm init`, detta ger oss package.json-filen. Därefter installerar vi våra dependencies genom att skriva `npm i express socket.io`. För att köra projektet startar vi servern med `node server.js` eller använder oss utav nodemon. I det senare fallet blir det `nodemon server.js`.

## Hur du kör projektet

Kör först npm install i din terminal:

```bash
npm install
```

Starta sedan servern:

```bash
node server.js
```

Du får då ett meddelande i terminalen att "Server is running". Gå till din webbläsare och skriv in localhost:3000. Sidan öppnas då i din webbläsare.

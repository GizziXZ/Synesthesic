# Screenshots
Home feed
![image](https://github.com/user-attachments/assets/a8068efe-ab76-4e8e-a6cf-464213fb640c)
Post cool art with music
![image](https://github.com/user-attachments/assets/6eaceb74-142b-428a-847f-0f22bf573ed7)

# Synesthesic
are you an artist who loves pinterest and sharing their art? ever struggled with the problem of 15 seconds not being enough when posting an instagram story with music to share your art?

I made every artist's favorite website, pinterest but with the music that every single artist loves to share alongside their art on instagram, best of all it works directly with spotify so it'll scrobble music for any last.fm users logged into spotify and you can also add a timestamp of where to start the song and it'll just keep playing for as long as the viewer wants it to!

so no more of that instagram 15 seconds crap when you know 15 seconds cant fit the song (because it's just too damn good)

## Features

* Scroll through a home feed almost exactly like pinterest's!
* Create a post with your art and your favorite song provided (you can also choose the timestamp it will start at!)
* Like posts and follow users if you like their posts!
* Show off your favorite song on your profile

## Hosting

Create a `config.json` inside `backend` and use the following template
```json
{
    "mongooseConnection":"mongodb+srv://yourmongo:dbserver@here.net/",
    "secret":"insert a jwt secret here"
}
```

Open a terminal and cd to `backend` and do the following commands
```bash
npm i
node index.js
```

Open another terminal and cd to `frontend` and do the following commands
```bash
npm i
npm start
```

#### Made with 💖 by Gizzi using React and Express

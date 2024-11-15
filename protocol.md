# Protocol

## Lobby Creation

A user can choose to create a new lobby.

Then they will send a request to

```
POST /api/create
```

The server is expected to respond with

```ts
{
    url: string // Lobby url
    id: string // Id for the lobby master (person that created the lobby)
}
```

The user should be redirected to the lobby url, and their new id should be written to local storage

## Lobby Joining

On joining a lobby, user connects to server socket and emits.

```ts
"ID" 
{
    name: string,
    id: string
    lobby: string
}
```

If the user is joining for the first time, both fields are null.

Otherwise, user use their id and name from local storage (rejoin logic)

---

If joined successful, server sends back to the user

```ts
"ID" 
{
    id: string
    name: string
    isMaster: boolean
    team: number
    players: {
        name: string
        team: string
    }[]
}
```

where id should be the same id as given by the user, or a new id if the user gave a null id.

If the id is unrecognised, the server responds with a new id

If the id is recognised, then send back the same id with same name and team

---

When another player joins, all other players are notified by

```ts
"PLAYER_IN"
{
    name: string
    team: string
}
```

And when a player leaves, all other players are notified by

```ts
"PLAYER_OUT"
{
    name: string
    team: string
}
```

## Game Starting

The lobby master sends to the server

```ts
"START"
{

}
```

And the server sends the following message back

```ts
"START"
{
    radios: string[] // All radio urls
    start: number // Index of starting radio
}
```

---

Users may select a country, sending the following message

```ts
"VOTE"
{
    country: string // 2 character ISO code
}
```

---

Every n seconds or so, the server will send the following message to each user

```ts
"POLLS"
{
    votes: {
        [country /* 2 characters */]: number // Number of votes per country
    }
}
```

---

Each user will keep track of their own time (god help us). In the final 10 seconds, the server will emit the following every second

```ts
"COUNTDOWN"
{
    time: number // Seconds left
}
```

When the countdown reaches zero, a result message is sent to all users

```ts
"RESULT"
{
    // Results
    country: string // The answer
    votes: {
        [team]: {
            [country]: number
        }
    }
    winner: team | null // Team number, null if no one wins
}
```

---

The lobby master may chose to continue to the lobby with the event 

```ts
"LOBBY"
{
}

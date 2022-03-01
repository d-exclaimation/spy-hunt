# Protocol

## JSON Protocol

### `Init`

**Client -> Server**

JSON Message sent by either client to iniitalize connection

> [Example](./json/init.json)

- `type: "init"`

---

### `Acknowledge`

**Server -> Client**

JSON Message sent by the server for the acknowledgement of client

> [Example](./json/ack.json)

- `type: "ack"`
- `payload:`
  - `id: String`

---

### `Update`

**Server -> Client**

JSON message sent by the server to keep the local state in sync with the server state

> [Example](./json/update_start.json)

- `type: "updated"`
- `payload:`
  - `state: Array[Agent & Window]`
  - `allies: Int`
  - `foes: Int`
  - `isTurn: Boolean`

---

### `Start`

**Server -> Client**

JSON Message sent by the server to initialize the state of all client

> [Example](./json/update_start.json)

- `type: "started"`
- `payload:`
  - `state: Array[Agent & Window]`
  - `allies: Int`
  - `foes: Int`
  - `isTurn: Boolean`

---

### `End`

**Server -> Client**

JSON Message sent by the server to end the game for all client

> [Example](./json/end.json)

- `type: "ended"`
- `payload:`
  - `state: Array[Agent & Window]`
  - `win: Boolean`
  - `reason: String`

---

### `Lock on`

**Client -> Server**

JSON Message sent by either client to target a window

> [Example](./json/indexed_action.json)

- `type: "lock"`
- `payload:`
  - `index: Int`

---

### `Fire`

**Client -> Server**

JSON Message sent by either client to fire on a targeted window

> [Example](./json/indexed_action.json)

- `type: "fire"`
- `payload:`
  - `index: Int`

---

### `Call`

**Client -> Server**

JSON Message sent by either client to save / call an agent in a window

> [Example](./json/indexed_action.json)

- `type: "fire"`
- `payload:`
  - `index: Int`

---

### `Shutter`

**Client -> Server**

JSON Message sent by either client to close all window shutter

> [Example](./json/action.json)

- `type: "shutter"`

---

### `Next`

**Client -> Server**

JSON Message sent by either client to move forward queue progress

> [Example](./json/action.json)

- `type: "next"`

---

## Data structure

### `Agent`

- `key: String`
- `team: 0 | 1 | 2`

---

### `Window`

- `isOpen: Boolean`
- `isTargeted: Boolean`

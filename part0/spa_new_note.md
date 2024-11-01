```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Calls notes update with javascript

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: updates notes
    deactivate server
```

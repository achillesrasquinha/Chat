![](.github/sample.gif)

```js
var chat = frappe.Chat.Client(`http://${YOUR_HOSTNAME}:${PORT}`)
chat.mount()

chat.on(frappe.Chat.Event.CONNECT, () => {
	console.log('Client: A client just connected.')
})
```
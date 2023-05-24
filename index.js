const express = require('express')
const uuid = require('uuid')

const port = 3001
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (req, res, next) => {
    const { id } = req.params

    const index = orders.findIndex(purchaseOrder => purchaseOrder.id === id)

    if (index < 0) {
        return res.status(404).json({ error: "User not found" })
    }

    req.orderIndex = index
    req.orderId = id

    next()
}

const methodUrl = (req, res, next) => {
    console.log('Request Type:', req.method)
    console.log('Request URL:', req.originalUrl)

    next()
}

app.post('/orders', methodUrl, (req, res) => {
    const { order, clientName, price } = req.body

    const purchaseOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(purchaseOrder)
    
    return res.status(201).json(purchaseOrder)
})

app.get('/orders', methodUrl, (req, res) => {
    return res.json(orders)
})

app.put('/orders/:id', checkOrderId, methodUrl, (req, res) => {
    const { order, clientName, price } = req.body
    const index = req.orderIndex
    const id = req.orderId

    const updateOrder = { id, order, clientName, price, status: "Em preparação " }

    orders[index] = updateOrder

    return res.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, methodUrl, (req, res) => {
    const index = req.orderIndex

    orders.splice(index, 1)

    return res.status(204).json()
})

app.get('/orders/:id', checkOrderId, methodUrl, (req, res) => {
    const index = req.orderIndex
    const purchaseOrder = orders[index]

    return res.json(purchaseOrder)
})

app.patch('/orders/:id', checkOrderId, methodUrl, (req, res) => {
    const index = req.orderIndex
    const purchaseOrder = orders[index]

    purchaseOrder.status = "Pronto"

    return res.json(purchaseOrder)
})



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})